const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ON VERCEL: Use the system temp folder
    // LOCALLY: Use your normal public/temp folder
    if (process.env.VERCEL) {
       cb(null, '/tmp'); 
    } else {
       cb(null, "./public/temp");
    }
  },
  filename: function (req, file, cb) {
    // Keep the unique filename logic
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

module.exports = multer({ storage });