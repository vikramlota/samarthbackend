const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  courseInterest: {
    type: String
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Converted', 'Closed'],
    default: 'New'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lead', LeadSchema);