const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const isJpgFile = (filePathOrBuffer, fileName) => {
    // Check extension from fileName or filePathOrBuffer string
    const targetName = typeof filePathOrBuffer === 'string' ? filePathOrBuffer : fileName;
    if (targetName) {
        const ext = path.extname(targetName).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg') {
            return true;
        }
    }

    // Check magic bytes if Buffer
    if (Buffer.isBuffer(filePathOrBuffer)) {
        if (filePathOrBuffer.length >= 3 &&
            filePathOrBuffer[0] === 0xff &&
            filePathOrBuffer[1] === 0xd8 &&
            filePathOrBuffer[2] === 0xff) {
            return true;
        }
    }

    // Check magic bytes if file path on disk
    if (typeof filePathOrBuffer === 'string' && fs.existsSync(filePathOrBuffer)) {
        try {
            const fd = fs.openSync(filePathOrBuffer, 'r');
            const buffer = Buffer.alloc(3);
            fs.readSync(fd, buffer, 0, 3, 0);
            fs.closeSync(fd);
            if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
                return true;
            }
        } catch (err) {
            // Ignore error and fall through
        }
    }

    return false;
};

const uploadOnCloudinary = async (filePathOrBuffer, fileName = 'upload', options = {}) => {
    try {
        if (!filePathOrBuffer) return null;

        // Verify Cloudinary credentials
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Missing Cloudinary credentials in environment variables');
        }

        const isAlreadyJpg = isJpgFile(filePathOrBuffer, fileName);
        const uploadOptions = {
            resource_type: "auto",
            ...options
        };

        // If it's not already JPG, convert to JPG on Cloudinary upload
        if (!isAlreadyJpg && !uploadOptions.format) {
            uploadOptions.format = "jpg";
        }

        let response;

        // Check if it's a buffer (from memory storage)
        if (Buffer.isBuffer(filePathOrBuffer)) {
            // Upload buffer as stream to Cloudinary
            response = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    uploadOptions,
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
            response = await cloudinary.uploader.upload(filePathOrBuffer, uploadOptions);

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

const deleteFromCloudinary = async (cloudinaryUrl) => {
    try {
        if (!cloudinaryUrl) return null;

        // Verify Cloudinary credentials
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.warn('Missing Cloudinary credentials. Cannot delete image.');
            return null;
        }

        // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v123456789/folder/image.jpg
        // Extract public_id
        const urlParts = cloudinaryUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex === -1) return null; // Not a valid Cloudinary upload URL

        // The parts after 'upload/' and 'v123456789/' (version) form the public ID
        // Often it looks like: upload/v123456/folder/image.jpg
        let publicIdParts = urlParts.slice(uploadIndex + 1);
        
        // Remove version if it exists (starts with 'v' and followed by numbers)
        if (publicIdParts[0] && /^v\d+$/.test(publicIdParts[0])) {
            publicIdParts.shift();
        }

        // Join the rest and remove the extension
        let publicId = publicIdParts.join('/');
        const lastDotIndex = publicId.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            publicId = publicId.substring(0, lastDotIndex);
        }

        if (!publicId) return null;

        const response = await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Cloudinary delete successful for ${publicId}:`, response.result);
        return response;
    } catch (error) {
        console.error("❌ Cloudinary delete error:", error.message || error);
        return null; // Don't throw, we don't want to crash the app if image deletion fails
    }
}

module.exports = { uploadOnCloudinary, deleteFromCloudinary };