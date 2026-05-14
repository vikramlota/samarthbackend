require('dotenv').config();
const mongoose = require('mongoose');
const Faculty = require('./src/models/Faculty.model.js');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  try {
    const mem = await Faculty.create({
      name: "Test Person",
      designation: "Test",
      qualification: "Test",
      experience: 1
    });
    console.log("Success", mem._id);
  } catch (err) {
    console.error("Error:", err.message);
  }
  process.exit(0);
}
test();
