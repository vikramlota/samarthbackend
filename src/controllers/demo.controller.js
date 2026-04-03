const DemoRequest = require('../models/demoRequest.model.js');

// @desc    Submit a new demo request (Public)
const createDemoRequest = async (req, res) => {
  try {
    const { name, email, phone, whatsapp, courseInterested } = req.body;
    
    if (!name || !email || !phone || !courseInterested) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newRequest = await DemoRequest.create({
      name, email, phone, whatsapp, courseInterested
    });

    res.status(201).json({ message: "Demo request submitted successfully!", data: newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all demo requests (Admin)
const getDemoRequests = async (req, res) => {
  try {
    const requests = await DemoRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update status (Admin)
const updateDemoStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await DemoRequest.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a request (Admin)
const deleteDemoRequest = async (req, res) => {
  try {
    await DemoRequest.findByIdAndDelete(req.params.id);
    res.json({ message: "Request deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDemoRequest, getDemoRequests, updateDemoStatus, deleteDemoRequest };