const mongoose = require("mongoose");
const cloudinaryDeletePlugin = require('../utils/cloudinaryDeletePlugin');

// Apply the Cloudinary auto-delete plugin to ALL models globally
mongoose.plugin(cloudinaryDeletePlugin);

const connectDB = async () => await mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.DB_NAME || "samarthacademy"
});
    

module.exports = connectDB;
