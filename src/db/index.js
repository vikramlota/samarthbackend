const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  dbName: "samarthacademy"
});

module.exports = connectDB;
