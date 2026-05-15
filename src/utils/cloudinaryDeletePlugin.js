const { deleteFromCloudinary } = require('./cloudinary');

// Helper to recursively find all Cloudinary URLs in a document
const extractCloudinaryUrls = (obj, urls = new Set()) => {
  if (!obj) return urls;

  if (typeof obj === 'string') {
    if (obj.startsWith('https://res.cloudinary.com/')) {
      urls.add(obj);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => extractCloudinaryUrls(item, urls));
  } else if (typeof obj === 'object') {
    Object.values(obj).forEach(val => extractCloudinaryUrls(val, urls));
  }

  return urls;
};

const cloudinaryDeletePlugin = (schema, options) => {
  // We need to capture the document BEFORE it gets deleted
  schema.pre(['findOneAndDelete', 'deleteOne', 'findOneAndRemove'], async function (next) {
    try {
      // 'this' is the query object
      const docToUpdate = await this.model.findOne(this.getFilter()).lean();
      if (docToUpdate) {
        const urls = extractCloudinaryUrls(docToUpdate);
        this._cloudinaryUrlsToDelete = Array.from(urls);
      }
    } catch (err) {
      console.error('Error in cloudinaryDeletePlugin pre hook:', err);
    }
    next();
  });

  // After the document is successfully deleted from the database
  schema.post(['findOneAndDelete', 'deleteOne', 'findOneAndRemove'], async function (doc, next) {
    try {
      const urls = this._cloudinaryUrlsToDelete;
      if (urls && urls.length > 0) {
        console.log(`🧹 Attempting to delete ${urls.length} Cloudinary images for deleted document.`);
        // Run deletions in parallel without blocking the response
        Promise.allSettled(urls.map(url => deleteFromCloudinary(url)));
      }
    } catch (err) {
      console.error('Error in cloudinaryDeletePlugin post hook:', err);
    }
    next();
  });
};

module.exports = cloudinaryDeletePlugin;
