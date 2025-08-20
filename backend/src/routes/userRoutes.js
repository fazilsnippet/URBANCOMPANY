

import express from "express";
import {  sendSignupOtp,
  registerUser,
  loginUser,
  userProfile,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,} from "../controllers/userController.js"
import {deleteUserAddress, addUserAddress, switchUserAddress, updateUserAddress} from "../controllers/userAddressController.js"
import { upload } from "../middlewares/multer.js";
import { verifyUser } from "../middlewares/authMiddleware.js";
const userRouter = express.Router();

// Public Routes
userRouter.post("/register", upload.single("avatar") , registerUser);  // Register user
userRouter.post("/login", loginUser);  // Login user
userRouter.post("/register/sendotp", sendSignupOtp);

// Protected Routes (Require JWT)
userRouter.post("/logout",    verifyUser, logoutUser);  // Logout user
userRouter.post("/refreshtoken", refreshAccessToken);  // Refresh access token

userRouter.put("/changepassword",    verifyUser, changeCurrentPassword);  // Change password
userRouter.put("/updateaccount",    verifyUser, upload.single("avatar"), updateAccountDetails);  // Update user account details
userRouter.get("/profile",    verifyUser, userProfile);  // Get user profile
userRouter.post("/address/add",    verifyUser, addUserAddress);  // Update user address
userRouter.patch("/address/update/:addressId",    verifyUser, updateUserAddress);  // Update user address
userRouter.delete("/address/:addressId",    verifyUser, deleteUserAddress);  // Update user address
userRouter.put("/address/change/:addressId",    verifyUser, switchUserAddress);  // Update user address


// Add recently viewed product
// Reset Password (Through a token from forgot-password)
// userRouter.post("/reset-password", handlePasswordReset);  // Reset password

// Route for verifying the OTP
export default userRouter;