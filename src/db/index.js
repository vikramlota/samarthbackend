const mongoose = require("mongoose");

const connectDB = async () => await mongoose.connect(process.env.MONGODB_URI, {
  dbName: "test"
});
    

module.exports = connectDB;
