const mongoose = require("mongoose");

const DB_NAME = "samarthacadamy";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\nMongoDB connecter!! DB HOST: ${connectionInstance.connection.host}`)
        return connectionInstance;
    } catch (error) {
        console.error("MONGODB connection error", error.message);
        // Don't exit in serverless environment - allow graceful degradation
        throw error;
    }
}

module.exports = connectDB;