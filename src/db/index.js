const mongoose = require("mongoose");
const DB_NAME = process.env.DB_NAME || 'samarthacademy';

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;

        // Safety net: if URI has no DB name (ends with / or just has query params), inject DB_NAME
        if (process.env.DB_NAME) {
            const hasDbName = /mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/.test(uri);
            if (!hasDbName) {
                uri = uri.replace(/(\?.*)$/, `/${process.env.DB_NAME}$1`);
                if (!uri.includes(`/${process.env.DB_NAME}`)) {
                    uri = `${uri.replace(/\/?$/, '')}/${process.env.DB_NAME}`;
                }
            }
        }

        const connectionInstance = await mongoose.connect(uri);

        console.log(`\nMongoDB connected!! DB HOST: ${connectionInstance.connection.host} | DB: ${connectionInstance.connection.name}`);
        return connectionInstance;
    } catch (error) {
        console.error("MONGODB connection error:", error.message);
        throw error;
    }
};

module.exports = connectDB;