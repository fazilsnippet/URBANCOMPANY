import mongoose from "mongoose";
import slugify from "slugify";
import asyncHandler from "../utils/asyncHandler.js";
import {Category} from "../models/Category.model.js"
import {Brand} from "../models/Brand.model.js"
import {Product} from "../models/Product.model.js"
import {Order} from "../models/orderModel.js"
import uploadOnCloudinary from "../utils/cloudinary.js";

// Create Product
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, categoryId, stock, brand } = req.body;
  const images = req.files?.path;

  // 1. Validate required fields
  if (!name || !price || !categoryId || !images?.length) {
    return res.status(400).json({ message: "Name, price, category, and images are required" });
  }

  // 2. Validate Category & Brand
  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) return res.status(400).json({ message: "Invalid category" });

  const brandExists = await Brand.findById(brand);
  if (!brandExists) return res.status(400).json({ message: "Invalid brand" });

  // 3. Upload images
  const uploadedImages = [];
  for (const file of images) {
    const uploaded = await uploadOnCloudinary(file.path);
    if (uploaded?.secure_url) uploadedImages.push(uploaded.secure_url);
    else return res.status(500).json({ message: "Failed to upload images" });
  }

  // 4. Generate slug
  const slug = slugify(name, { lower: true });

  // 5. Create & save
  const newProduct = new Product({
    name,
    slug,
    description,
    price,
    images: uploadedImages,
    categories: [categoryId],
    stock,
    brand,
  });
  await newProduct.save();

  // 6. Respond
  res.status(201).json({ message: "Product created successfully", product: newProduct });
});

// Get All Products with Filters, Sorting & Pagination
export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    brand,
    category,
    minPrice,
    maxPrice,
    search,
    sort = "createdAt:desc",
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {};

  // Brand filter
  if (brand) filter.brand = brand;

  // Category filter (array field)
  if (category) filter.categories = { $in: [category] };

  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  // Text search
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  // Parse sort
  const [sortField, sortOrder] = sort.split(":");
  const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

  // Pagination
  const perPage = parseInt(limit, 10);
  const skip = (parseInt(page, 10) - 1) * perPage;

  // Execute queries in parallel
  const [products, totalCount] = await Promise.all([
    Product.find(filter)
      .populate({ path: "brand", select: "name", match: { isActive: true } })
      .populate({ path: "categories", select: "name", match: { isActive: true } })
      .sort(sortOptions)
      .skip(skip)
      .limit(perPage),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    products,
    pagination: {
      totalCount,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalCount / perPage),
      limit: perPage,
    },
    filtersApplied: { brand, category, minPrice, maxPrice, search, sort },
  });
});

// Get Single Product by ID
export const getProductById = asyncHandler(async (req, res) => {
  let { productId } = req.params;
  productId = String(productId);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const product = await Product.findById(productId)
    .populate("brand", "name")
    .populate("categories", "name");

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
});

// Simple List of Products (no filters)
export const getProducts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const products = await Product.find().limit(limit);
  res.status(200).json({ products });
});

// Top Selling Products
export const getTopSellingProducts = asyncHandler(async (req, res) => {
  let limit = parseInt(req.query.limit) || 20;
  const skip = parseInt(req.query.skip) || 0;
  if (limit > 100) limit = 100;

  const topProducts = await Order.aggregate([
    {
      $match: {
        status: { $in: ["paid", "attempted"] },
        "products.productId": { $type: "objectId", $ne: null },
      },
    },
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.productId",
        totalSold: { $sum: "$products.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: 0,
        productId: "$product._id",
        name: "$product.name",
        brand: "$product.brand",
        images: "$product.images",
        price: "$product.price",
        totalSold: 1,
      },
    },
  ]);

  res.status(200).json(topProducts);
});

// Most Recent Products
export const getRecentProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const skip = parseInt(req.query.skip) || 0;

  const [products, totalCount] = await Promise.all([
    Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("brand", "name")
      .populate("categories", "name"),
    Product.countDocuments({ isActive: true }),
  ]);

  res.status(200).json({
    products,
    pagination: {
      totalCount,
      skip,
      limit,
    },
  });
});

// Related Products by Category
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const currentProduct = await Product.findById(productId);
  if (!currentProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  const related = await Product.find({
    categories: { $in: currentProduct.categories },
    _id: { $ne: currentProduct._id },
  })
    .limit(8)
    .populate("brand", "name")
    .populate("categories", "name");

  res.status(200).json(related);
});


// Update Product
export const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const {
    name,
    description,
    price,
    categoryId,
    stock,
    brand
  } = req.body;
  const files = req.files; // optional new images

  // 1. Validate ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  // 2. Fetch existing product
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // 3. Validate & assign simple fields
  if (name) {
    product.name = name;
    product.slug = slugify(name, { lower: true });
  }
  if (description != null) product.description = description;
  if (price != null) product.price = price;
  if (stock != null) product.stock = stock;

  // 4. Handle category update
  if (categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const cat = await Category.findById(categoryId);
    if (!cat) return res.status(400).json({ message: "Category not found" });
    product.categories = [categoryId];
  }

  // 5. Handle brand update
  if (brand) {
    if (!mongoose.Types.ObjectId.isValid(brand)) {
      return res.status(400).json({ message: "Invalid brand ID" });
    }
    const br = await Brand.findById(brand);
    if (!br) return res.status(400).json({ message: "Brand not found" });
    product.brand = brand;
  }

  // 6. Handle image replacements
  if (files && files.length) {
    const uploaded = [];
    for (const file of files) {
      const img = await uploadOnCloudinary(file.path);
      if (!img?.secure_url) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      uploaded.push(img.secure_url);
    }
    // Replace old images with new set (or merge: product.images.push(...uploaded))
    product.images = uploaded;
  }

  // 7. Save & respond
  const updated = await product.save();
  res.status(200).json({ message: "Product updated", product: updated });
});

export const deleteProduct = asyncHandler(async (req, res) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  const product = await Product.findByIdAndDelete(req.params.productId);

  if (!product) return res.status(404).json({ message: "Product not found" });

  res.status(200).json({ message: "Product deleted successfully" });
});