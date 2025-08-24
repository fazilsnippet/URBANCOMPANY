import  ApiError  from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { PartnerProfile } from "../models/partnerProfile.model.js";
import { Admin } from "../models/admin.model.js";
import asyncHandler from "../utils/asyncHandler.js";
// User middleware
export const verifyUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) throw new ApiError(401, "Unauthorized: No token provided");

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded?._id).select("-password");
    if (!user) throw new ApiError(401, "Unauthorized: Invalid user");
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, "Unauthorized: Invalid or expired user token");
  }
});

// Partner middleware
export const verifyPartner = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.partnerToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) throw new ApiError(401, "Unauthorized: No token provided");

  try {
    const decoded = jwt.verify(token, process.env.PARTNER_ACCESS_SECRET);
    const partner = await User.findById(decoded?._id).select("-password");
    if (!partner) throw new ApiError(401, "Unauthorized: Invalid partner");
    req.partner = partner;
    next();
  } catch (err) {
    throw new ApiError(401, "Unauthorized: Invalid or expired partner token");
  }
});

// Admin middleware
export const verifyAdmin = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.adminToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) throw new ApiError(401, "Unauthorized: No token provided");

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_SECRET);
    const admin = await Admin.findById(decoded?._id).select("-password");
    if (!admin) throw new ApiError(401, "Unauthorized: Invalid admin");
    req.admin = admin;
    next();
  } catch (err) {
    throw new ApiError(401, "Unauthorized: Invalid or expired token");
  }
});
