import express from 'express'


import express from "express";
import {deleteUserAddress, addUserAddress, switchUserAddress, updateUserAddress} from "../controllers/userAddressController.js"
import { verifyuser } from "../middlewares/authMiddleware.js";  // Assuming you have an auth middleware to verify JWT token
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();

// Public Routes
userRouter.post("/register", upload.single("avatar") , registerUser);  // Register user
userRouter.post("/login", loginUser);  // Login user
userRouter.post("/register/sendotp", sendSignupOtp);

// Protected Routes (Require JWT)
userRouter.post("/logout",    verifyuser, logoutUser);  // Logout user
userRouter.post("/refreshtoken", refreshAccessToken);  // Refresh access token

userRouter.put("/changepassword",    verifyuser, changeCurrentPassword);  // Change password
userRouter.put("/updateaccount",    verifyuser, upload.single("avatar"), updateAccountDetails);  // Update user account details
userRouter.get("/profile",    verifyuser, userProfile);  // Get user profile
userRouter.post("/address/add",    verifyuser, addUserAddress);  // Update user address
userRouter.patch("/address/update/:addressId",    verifyuser, updateUserAddress);  // Update user address
userRouter.delete("/address/:addressId",    verifyuser, deleteUserAddress);  // Update user address
userRouter.put("/address/change/:addressId",    verifyuser, switchUserAddress);  // Update user address


// Add recently viewed product
// Reset Password (Through a token from forgot-password)
// userRouter.post("/reset-password", handlePasswordReset);  // Reset password

// Route for verifying the OTP
export default userRouter;