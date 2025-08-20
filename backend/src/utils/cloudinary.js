// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

//  const uploadOnCloudinary = async (filePath) => {
//   try {
//     if (!filePath) return null; // Return early if file path is not provided

//     const result = await cloudinary.uploader.upload(filePath, {
//       resource_type: "auto", // Auto-detect file type (image, video, etc.)
//     });

//     fs.unlink(filePath, (err) => {
//       if (err) console.error(`Failed to delete local file: ${filePath}`, err);
//     });

//     return result;
//   } catch (error) {
//     console.error("Cloudinary Upload Error:", error.message);
//     return null; // Explicitly return null if upload fails
//   }
// };

// export default uploadOnCloudinary


import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv'
dotenv.config({
  path: "./.env"
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

 const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null; // Return early if file path is not provided

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", // Auto-detect file type (image, video, etc.)
    });

    fs.unlink(filePath, (err) => {
      if (err) console.error(`Failed to delete local file: ${filePath}`, err);
    });

    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    return null; // Explicitly return null if upload fails
  }
};

export default uploadOnCloudinary