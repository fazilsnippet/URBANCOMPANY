import slugify from "slugify";
import { Service } from "../models/service.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    Create a new service
 */
 const createService = asyncHandler(async (req, res) => {
  const {
    title,
    partner,
    mainCategory,
    suCategories,
    description,
    images,
    pricing,
    durationMins,
    locationType,
    address,
    geo,
  } = req.body;

  if (!title || !partner || !mainCategory || !pricing?.amount) {
    throw new ApiError(400, "Missing required fields");
  }

  const slug = slugify(title, { lower: true, strict: true });

  const service = await Service.create({
    title,
    slug,
    partner,
    mainCategory,
    suCategories,
    description,
    images,
    pricing,
    durationMins,
    locationType,
    address,
    geo,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, service, "Service created successfully"));
});

/**
 * @desc    Update a service
 */
 const updateService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  let service = await Service.findById(serviceId);
  if (!service) throw new ApiError(404, "Service not found");

  // If title changes, regenerate slug
  if (req.body.title) {
    req.body.slug = slugify(req.body.title, { lower: true, strict: true });
  }

  service = await Service.findByIdAndUpdate(id, req.body, { new: true });

  return res.json(new ApiResponse(200, service, "Service updated successfully"));
});

/**
 * @desc    Delete a service
 */
  const deleteService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const service = await Service.findByIdAndDelete(serviceId);
  if (!service) throw new ApiError(404, "Service not found");

  return res.json(new ApiResponse(200, {}, "Service deleted successfully"));
});

/**
 * @desc    Toggle service active/inactive
 */
  const toggleServiceActive = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const service = await Service.findById(serviceId);
  if (!service) throw new ApiError(404, "Service not found");

  service.isActive = !service.isActive;
  await service.save();

  return res.json(
    new ApiResponse(
      200,
      service,
      `Service is now ${service.isActive ? "active" : "inactive"}`
    )
  );
});

/**
 * @desc    Get service by ID
 */
  const getServiceById = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const service = await Service.findById(serviceId)
    .populate("partner", "name")
    .populate("mainCategory", "name")
    .populate("suCategories", "name");

  if (!service) throw new ApiError(404, "Service not found");

  return res.json(new ApiResponse(200, service, "Service fetched successfully"));
});

/**
 * @desc    Get all services (with filters + pagination)
 */
  const getAllServices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isActive, partner } = req.query;
  const query = {};

  if (isActive) query.isActive = isActive === "true";
  if (partner) query.partner = partner;

  const services = await Service.find(query)
    .populate("partner", "name")
    .populate("mainCategory", "name")
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Service.countDocuments(query);

  return res.json(
    new ApiResponse(200, { services, total }, "Services fetched successfully")
  );
});

/**
 * @desc    Get services by category (main or sub)
 */
  const getServicesByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const services = await Service.find({
    $or: [{ mainCategory: categoryId }, { suCategories: categoryId }],
    isActive: true,
  })
    .populate("partner", "name")
    .populate("mainCategory", "name")
    .populate("suCategories", "name");

  return res.json(
    new ApiResponse(200, services, "Services by category fetched successfully")
  );
});


export default {createService, getServiceById, getAllServices, getServicesByCategory, deleteService, updateService, toggleServiceActive}