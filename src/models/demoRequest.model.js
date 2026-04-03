const mongoose = require("mongoose");

const demoRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: false },
    courseInterested: { type: String, required: false },
    status: { 
      type: String, 
      enum: ['Pending', 'Contacted', 'Resolved'], 
      default: 'Pending' 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DemoRequest", demoRequestSchema);