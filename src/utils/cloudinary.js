const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { Readable } = require('stream');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (filePathOrBuffer, fileName = 'upload') => {
    try {
        if (!filePathOrBuffer) return null;

        // Verify Cloudinary credentials
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Missing Cloudinary credentials in environment variables');
        }

        let response;

        // Check if it's a buffer (from memory storage)
        if (Buffer.isBuffer(filePathOrBuffer)) {
            // Upload buffer as stream to Cloudinary
            response = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "auto" },
                    (error, result) => {
                        if (error) {
                            console.error("❌ Cloudinary stream upload error:", error);
                            reject(error);
                        } else {
                            console.log("✅ Cloudinary upload successful:", result.secure_url);
                            resolve(result);
                        }
                    }
                );
                Readable.from(filePathOrBuffer).pipe(stream);
            });
        } else {
            // It's a file path string (from disk storage)
            response = await cloudinary.uploader.upload(filePathOrBuffer, {
                resource_type: "auto"
            });

            // Remove local file if it exists
            try {
                fs.unlinkSync(filePathOrBuffer);
            } catch (e) {
                console.log("Error deleting local file:", e);
            }
        }

        return response;

    } catch (error) {
        console.error("❌ Cloudinary upload error:", error.message || error);
        throw error; // Throw the error instead of returning null so the controller can handle it
    }
}

module.exports = { uploadOnCloudinary };