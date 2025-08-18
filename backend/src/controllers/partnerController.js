import { PartnerProfile } from "../models/partnerProfile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponce.js";
import slugify from "slugify";

// Create partner profile
    const createPartnerProfile = asyncHandler(async (req, res) => {
  const { user, businessName, about, kyc, serviceAreas, payout } = req.body;

  if (!user || !businessName) {
    throw new ApiError(400, "User and businessName are required");
  }

  const slug = slugify(businessName, { lower: true, strict: true });

  const existing = await PartnerProfile.findOne({ $or: [{ user }, { slug }] });
  if (existing) throw new ApiError(400, "Profile already exists for this user or business");

  const profile = await PartnerProfile.create({
    user,
    businessName,
    slug,
    about,
    kyc,
    serviceAreas,
    payout,
  });

  res.status(201).json(new ApiResponse(201, profile, "Partner profile created successfully"));
});

// Get profile by ID
    const getPartnerProfileById = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;

  const profile = await PartnerProfile.findById(partnerId).populate("user", "name email");
  if (!profile) throw new ApiError(404, "Partner profile not found");

  res.json(new ApiResponse(200, profile, "Partner profile fetched successfully"));
});



// Get all profiles
    const getAllPartnerProfiles = asyncHandler(async (req, res) => {
  const { isActive } = req.query;
  const filter = {};

  if (isActive !== undefined) filter.isActive = isActive === "true";

  const profiles = await PartnerProfile.find(filter).populate("user", "name email");

  res.json(new ApiResponse(200, profiles, "All partner profiles fetched successfully"));
});

// Update partner profile
    const updatePartnerProfile = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;
  const updates = req.body;

  if (updates.businessName) {
    updates.slug = slugify(updates.businessName, { lower: true, strict: true });
  }

  const profile = await PartnerProfile.findByIdAndUpdate(partnerId, updates, { new: true, runValidators: true });

  if (!profile) throw new ApiError(404, "Partner profile not found");

  res.json(new ApiResponse(200, profile, "Partner profile updated successfully"));
});

// Toggle active status
    const togglePartnerActive = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;

  const profile = await PartnerProfile.findById(partnerId);
  if (!profile) throw new ApiError(404, "Partner profile not found");

  profile.isActive = !profile.isActive;
  await profile.save();

  res.json(new ApiResponse(200, profile, `Partner profile ${profile.isActive ? "activated" : "deactivated"}`));
});

// Delete partner profile
    const deletePartnerProfile = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;

  const profile = await PartnerProfile.findByIdAndDelete(partnerId);
  if (!profile) throw new ApiError(404, "Partner profile not found");

  res.json(new ApiResponse(200, null, "Partner profile deleted successfully"));
});

export default {deletePartnerProfile, getAllPartnerProfiles, getPartnerProfileById, updatePartnerProfile,createPartnerProfile, togglePartnerActive
}