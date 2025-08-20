import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import  ApiError  from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponce.js";
dotenv.config("../../.env");
import  uploadOnCloudinary  from "../utils/cloudinary.js";
import { OTP } from "../models/otp.model.js"; 
import { generateOtp } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";
import asyncHandler from "../utils/asyncHandler.js";
export const generateAccessTokenAndRefreshToken = async (userId) => {
  if (!userId || userId.length === 0 ) throw new ApiError(400, "User ID is required to generate tokens");

  const accessToken = jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );

  // Save refreshToken in DB
  await User.findByIdAndUpdate(userId, { refreshToken });

  return { accessToken, refreshToken };
};




 const sendSignupOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) throw new ApiError(400, "Email is required");

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "User already exists");

  const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await OTP.deleteMany({ email, purpose: "signup" });
  await OTP.create({ email, otp: otpCode, purpose: "signup", expiresAt });

  console.log("Signup OTP:", otpCode); // For Postman/dev testing
  await sendEmail(email, "Signup OTP", `Your OTP is ${otpCode}`);

  res.json({ message: "OTP sent to your email" });
});


// const registerUser = asyncHandler(async (req, res) => {
//   let { email, name, password, phone, otp, addresses } = req.body;

//   // Validate required fields
//   if ([email, name, password, otp].some((field) => !field?.trim())) {
//     throw new ApiError(400, "All fields are required");
//   }

//   // Check OTP
//   const otpRecord = await OTP.findOne({ email, otp, purpose: "signup" });
//   if (!otpRecord) throw new ApiError(400, "Invalid OTP");
//   if (otpRecord.expiresAt < new Date()) throw new ApiError(400, "OTP expired");

//   // Check if user exists
//   const existedUser = await User.findOne({
//     $or: [{ name }, { email }, { phone }]
//   });
//   if (existedUser) throw new ApiError(409, "User already exists");

//   // Delete OTP record
//   await OTP.deleteMany({ email, purpose: "signup" });

//   // Avatar upload
//   let avatarUrl = null;
//   if (req.file) {
//     const cloudinaryResult = await uploadOnCloudinary(req.file.path);
//     if (cloudinaryResult?.secure_url) avatarUrl = cloudinaryResult.secure_url;
//     else throw new ApiError(500, "Avatar upload failed");
//   }

//   //   Handle addresses (if sent as string in multipart/form-data)
//   if (typeof addresses === "string") {
//     try {
//       addresses = JSON.parse(addresses);
//     } catch {
//       throw new ApiError(400, "Invalid addresses format");
//     }
//   }

//   //   Ensure addresses is an array (even if empty)
//   if (!Array.isArray(addresses)) {
//     addresses = [];
//   }

//   // Create user
//   const user = await User.create({
//     email,
//     name,
//     password,
//     phone,
//     avatar: avatarUrl,
//     addresses // will save as array of objects
//   });

//   // Get safe user object
//   const userWithoutPassword = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   return res.status(201).json({
//     user: userWithoutPassword,
//     message: "User registered successfully",
//   });
// });




const registerUser = asyncHandler(async (req, res) => {
  const {  email, name, password, phone , addresses} = req.body;

  if ([ email, name, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    addresses,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

return res
  .json(new ApiResponse(201, { user: createdUser, accessToken:createdUser.accessToken }, "User registered successfully"));});




const loginUser = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  if ((!email && !name) || !password) {
    throw new ApiError(400, "Please provide both email/name and password");
  }

  const user = await User.findOne({ $or: [{ name }, { email }] });
  if (!user) throw new ApiError(404, "name or email does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(409, "Invalid user password");

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      user: loggedInUser,
      message: "User logged in successfully",
    });
});


const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "user logged out successfully" });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request please login");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?.id);

    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token please login");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          "accessToken refreshed..!"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token please login");
  }
});


const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password updated successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
 const { name,  email } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized     please login");
  }

  if (!name || !email) {
    throw new ApiError(400, "All fields are required");
  }

  let avatarUrl = null;
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (uploadResult?.secure_url) {
      avatarUrl = uploadResult.secure_url;
    } else {
      throw new ApiError(500, "Failed to upload avatar");
    }
  }

  const updates = {
    name,
    email,
  };

  if (avatarUrl) updates.avatar = avatarUrl;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedUser, "All details have been updated")
  );
});




const userProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id)
    .select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userProfile = {
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    addresses: user.addresses, 
  };

  res.status(200).json(
    new ApiResponse(200, userProfile, "User profile fetched successfully")
  );
});






export {
  sendSignupOtp,
  registerUser,
  loginUser,
  userProfile,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
};