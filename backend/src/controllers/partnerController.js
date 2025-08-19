import { PartnerProfile } from "../models/partnerProfile.model.js";
import  asyncHandler  from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {ApiResponse} from "../utils/apiResponce.js";
import slugify from "slugify";

// Create partner profile
const createPartnerProfile = asyncHandler(async (req, res) => {
  //  Whitelist allowed fields
  const allowedFields = ["user", "businessName", "about", "serviceAreas", "payout"];
  const data = {};

  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      data[key] = req.body[key];
    }
  }

  //  Handle avatar upload
  if (req.file?.path) {
    data.avatar = req.file.path;
  }

  // Required fields check
  if (!data.user || !data.businessName) {
    throw new ApiError(400, "User and businessName are required");
  }

  //  Generate slug
  data.slug = slugify(data.businessName, { lower: true, strict: true });

  //  Optional: validate serviceAreas format
  if (data.serviceAreas && !Array.isArray(data.serviceAreas)) {
    throw new ApiError(400, "Invalid serviceAreas format");
  }

  let profile;
  try {
    profile = await PartnerProfile.create(data);
  } catch (err) {
    if (err.code === 11000) {
      if (err.keyPattern?.user) {
        throw new ApiError(400, "Profile already exists for this user");
      }
      if (err.keyPattern?.slug) {
        throw new ApiError(400, "Business name already in use, please choose another");
      }
    }
    throw err;
  }

  res.status(201).json(new ApiResponse(201, profile, "Partner profile created successfully"));
});


// Get profile by ID
const getPartnerProfileById = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;

  const profile = await PartnerProfile.findById(partnerId).populate("user", "name email");
  if (!profile) {
    throw new ApiError(404, "Partner profile not found");
  }

  res.json(new ApiResponse(200, profile, "Partner profile fetched successfully"));
});

// Get all profiles
const getAllPartnerProfiles = asyncHandler(async (req, res) => {
  const { isActive } = req.query;
  const filter = {};

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const profiles = await PartnerProfile.find(filter).populate("user", "name email");

  res.json(new ApiResponse(200, profiles, "All partner profiles fetched successfully"));
});

// Update partner profile
const updatePartnerProfile = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;

  //  Whitelist allowed fields
  const allowedFields = ["businessName", "about", "serviceAreas", "payout"];
  const updates = {};

  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  //   Handle avatar upload
  if (req.file?.path) {
    updates.avatar = req.file.path;
  }

  //   Regenerate slug if businessName changes
  if (updates.businessName) {
    updates.slug = slugify(updates.businessName, { lower: true, strict: true });
  }

  let profile;
  try {
    profile = await PartnerProfile.findByIdAndUpdate(partnerId, updates, {
      new: true,
      runValidators: true,
    });
  } catch (err) {
    //   Handle duplicate slug error gracefully
    if (err.code === 11000 && err.keyPattern?.slug) {
      throw new ApiError(400, "Business name already in use, please choose another");
    }
    throw err; // rethrow if it's a different error
  }

  if (!profile) {
    throw new ApiError(404, "Partner profile not found");
  }

  res.json(new ApiResponse(200, profile, "Partner profile updated successfully"));
});

// Toggle active status
const togglePartnerActive = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;

  const profile = await PartnerProfile.findById(partnerId);
  if (!profile) {
    throw new ApiError(404, "Partner profile not found");
  }

  profile.isActive = !profile.isActive;
  await profile.save();

  res.json(
    new ApiResponse(200, profile, `Partner profile ${profile.isActive ? "activated" : "deactivated"}`)
  );
});

// Delete partner profile
const deletePartnerProfile = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;

  const profile = await PartnerProfile.findByIdAndDelete(partnerId);
  if (!profile) {
    throw new ApiError(404, "Partner profile not found");
  }

  res.json(new ApiResponse(200, null, "Partner profile deleted successfully"));
});

export {
  createPartnerProfile,
  getPartnerProfileById,
  getAllPartnerProfiles,
  updatePartnerProfile,
  togglePartnerActive,
  deletePartnerProfile,
};
