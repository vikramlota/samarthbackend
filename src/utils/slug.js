function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate unique slug — appends -2, -3 etc. on collision.
 * @param {Model} Model - Mongoose model to check against
 * @param {string} text - Source text to slugify
 * @param {ObjectId} excludeId - Exclude this document's own slug when updating
 */
async function generateUniqueSlug(Model, text, excludeId = null) {
  const baseSlug = slugify(text);
  if (!baseSlug) throw new Error('Cannot generate slug from empty text');

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const filter = { slug };
    if (excludeId) filter._id = { $ne: excludeId };

    const exists = await Model.findOne(filter).lean();
    if (!exists) return slug;

    counter++;
    slug = `${baseSlug}-${counter}`;

    if (counter > 100) {
      slug = `${baseSlug}-${Date.now()}`;
      return slug;
    }
  }
}

module.exports = { slugify, generateUniqueSlug };
