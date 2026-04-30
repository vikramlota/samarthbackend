const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`\nMongoDB connected!! DB HOST: ${connectionInstance.connection.host} | DB: ${connectionInstance.connection.name}`);
        return connectionInstance;
    } catch (error) {
        console.error("MONGODB connection error:", error.message);
        throw error;
    }
};

module.exports = connectDB;
