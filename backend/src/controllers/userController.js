import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
dotenv.config("../../.env");
import asyncHandler from "express-async-handler";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { OTP } from "../models/otp.model.js"; 
import { generateOtp } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";






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


 const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, userName, password, phone, otp, addresses } = req.body;

  // Validate required fields
  if ([fullName, email, userName, password, otp].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check OTP
  const otpRecord = await OTP.findOne({ email, otp, purpose: "signup" });
  if (!otpRecord) throw new ApiError(400, "Invalid OTP");
  if (otpRecord.expiresAt < new Date()) throw new ApiError(400, "OTP expired");

  // Check if user exists
  const existedUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existedUser) throw new ApiError(409, "User already exists");

  // Delete OTP record
  await OTP.deleteMany({ email, purpose: "signup" });

  // Avatar upload
  let avatarUrl = null;
  if (req.file) {
    const cloudinaryResult = await uploadOnCloudinary(req.file.path);
    if (cloudinaryResult?.secure_url) avatarUrl = cloudinaryResult.secure_url;
    else throw new ApiError(500, "Avatar upload failed");
  }

  // Create user
  const user = await User.create({
    fullName,
    email,
    userName,
    password,
    phone,
    avatar: avatarUrl,
    addresses
  });

  // Generate tokens
//   const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  // Get safe user object
  const userWithoutPassword = await User.findById(user._id).select("-password -refreshToken");

  return res.status(201).json({
    user: userWithoutPassword,
    // accessToken,
    // refreshToken,
    message: "User registered successfully",
  });
});





const loginUser = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;

  if ((!email && !userName) || !password) {
    throw new ApiError(400, "Please provide both email/username and password");
  }

  const user = await User.findOne({ $or: [{ userName }, { email }] });
  if (!user) throw new ApiError(404, "Username or email does not exist");

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
 const { fullName, email } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized     please login");
  }

  if (!fullName || !email) {
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
    fullName,
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





 const updateUserAddress = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized  please login");
  }

  let { addresses } = req.body;

  if (!addresses) {
    throw new ApiError(400, "all the address fields are required !!!");
  }

  // If address is stringified JSON (common in multipart/form-data), parse it
  if (typeof addresses === "string") {
    try {
      addresses = JSON.parse(address);
    } catch {
      throw new ApiError(400, "Invalid address format");
    }
  }

  const updateFields = {
    ...(addresses.line1 && { "addresses.line1": addresses.line1 }),
        ...(addresses.line2 && { "addresses.line2": addresses.line2 }),

    ...(addresses.city && { "address.city": addresses.city }),
    ...(addresses.state && { "address.state": addresses.state }),
    ...(addresses.pincode && { "address.postalCode": addresses.postalCode }),
    ...(addresses.country && { "address.country": addresses.country }),
  };

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedUser.addresses, "Address updated successfully")
  );
});



const userProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userProfile = {
    fullName: user?.fullName,
    email: user?.email,
    userName: user?.userName,
    avatar: user?.avatar,
    addresses: user?.addresses
    
  };

  

  return res
    .status(200)
    .json(new ApiResponse(200, userProfile, "User profile fetched successfully"));
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
  updateUserAddress,
  
  
};