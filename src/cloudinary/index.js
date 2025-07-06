const cloudinary = require('cloudinary').v2;
require('dotenv/config');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const geturl = async (key) => {
    try {
        // Cloudinary already serves files via URL, no need for signed URLs
        // This returns the URL of the resource
        return cloudinary.url(key);
    } catch (error) {
        throw error;
    }
};

async function putobject() {
    try {
        // For Cloudinary, we don't generate URLs beforehand like S3
        // Instead, we return a signature that can be used for direct uploads from client
        const timestamp = Math.round((new Date).getTime() / 1000);
        const public_id = `${Date.now()}`;

        const signature = cloudinary.utils.api_sign_request({
            timestamp: timestamp,
            public_id: public_id
        }, process.env.CLOUDINARY_API_SECRET);

        const data = {
            signature,
            timestamp,
            public_id,
            api_key: process.env.CLOUDINARY_API_KEY,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME
        }
        return data;
    } catch (error) {
        throw error;
    }
}

// function getPublicIdFromUrl(url) {
//   if (!url || typeof url !== 'string') return null;

//   try {
//     const parts = url.split('/');
//     const uploadIndex = parts.indexOf('upload');
//     if (uploadIndex === -1 || uploadIndex + 1 >= parts.length) return null;

//     const pathAfterUpload = parts.slice(uploadIndex + 1).join('/');
//     const publicId = pathAfterUpload.replace(/\.[^/.]+$/, ''); // remove file extension
//     return publicId;
//   } catch (err) {
//     console.error("Error extracting public ID from URL:", err);
//     return null;
//   }
// }

function getPublicIdFromUrl(url) {
if (!url || typeof url !== 'string') return null;

  const parts = url.split('/');
  const filename = parts[parts.length - 1]; // e.g., sample.jpg
  const publicId = filename.split('.')[0]; // remove file extension
  return publicId;
}



async function deleteImg(url) {
  const publicId = getPublicIdFromUrl(url);
  if (!publicId) {
    console.warn("Invalid or missing Cloudinary URL, skipping delete.");
    return;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Failed to delete Cloudinary image:", error);
    throw error;
  }
}


module.exports = { geturl, putobject, deleteImg };
