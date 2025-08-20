import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
const addUserAddress = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized, please login");

  let { address } = req.body;
  if (!address) throw new ApiError(400, "Address data is required!");

  // Handle JSON string from form-data
  if (typeof address === "string") {
    try {
      address = JSON.parse(address);
    } catch {
      throw new ApiError(400, "Invalid address format");
    }
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  if (user.addresses.length >= 5) {
    throw new ApiError(400, "You can only save up to 5 addresses");
  }

  // If no default address exists, set this as default
  if (!user.addresses.some(addr => addr.isDefault)) {
    address.isDefault = true;
  }

  user.addresses.push(address);
  await user.save();

  res.status(200).json(new ApiResponse(200, user.addresses, "Address added successfully"));
});


const switchUserAddress = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { addressId } = req.body;

  if (!userId) throw new ApiError(401, "Unauthorized, please login");
  if (!addressId) throw new ApiError(400, "Address ID required");

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Reset all to false
  user.addresses.forEach(addr => { addr.isDefault = false; });

  // Set new default
  const target = user.addresses.id(addressId);
  if (!target) throw new ApiError(404, "Address not found");
  target.isDefault = true;

  await user.save();

  res.status(200).json(new ApiResponse(200, user.addresses, "Default address switched successfully"));
});


const deleteUserAddress = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { addressId } = req.params;

  if (!userId) throw new ApiError(401, "Unauthorized, please login");
  if (!addressId) throw new ApiError(400, "Address ID required");

  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { addresses: { _id: addressId } } },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) throw new ApiError(404, "User not found");

  // If default was deleted, make first one default (if exists)
  if (user.addresses.length && !user.addresses.some(a => a.isDefault)) {
    user.addresses[0].isDefault = true;
    await user.save();
  }

  res.status(200).json(new ApiResponse(200, user.addresses, "Address deleted successfully"));
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { addressId } = req.params;
  let { address } = req.body;

  if (!userId) throw new ApiError(401, "Unauthorized, please login");
  if (!addressId) throw new ApiError(400, "Address ID is required");

  // Handle JSON string from form-data
  if (typeof address === "string") {
    try {
      address = JSON.parse(address);
    } catch {
      throw new ApiError(400, "Invalid address format");
    }
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const target = user.addresses.id(addressId);
  if (!target) throw new ApiError(404, "Address not found");

  // Update fields dynamically
  Object.assign(target, address);

  await user.save();

  res.status(200).json(new ApiResponse(200, user.addresses, "Address updated successfully"));
});


export  {deleteUserAddress, addUserAddress, switchUserAddress, updateUserAddress}