import express from 'express'

import {registerUser, loginUser, logoutUser , refreshAccessToken} from "../controllers/userController"
const authRouter = express.Router();

authRouter.post("/register", upload.single("avatar") , registerUser);  // Register user
authRouter.post("/login", loginUser);  // Login user
authRouter.post("/register/sendotp", sendSignupOtp);

// Protected Routes (Require JWT)
authRouter.post("/logout", verifyJWT, logoutUser);  // Logout user
authRouter.post("/refreshtoken", refreshAccessToken);  // Refresh access token

authRouter.put("/changepassword", verifyJWT, changeCurrentPassword);  // Change password
authRouter.put("/updateaccount", verifyJWT, upload.single("avatar"), updateAccountDetails); 

export default authRouter