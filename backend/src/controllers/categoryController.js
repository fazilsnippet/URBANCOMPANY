// import asyncHandler from 'express-async-handler';
import { Category } from '../models/Category.model.js';
import { Product } from '../models/Product.model.js';
import { Service } from '../models/service.model.js';
import mongoose from 'mongoose'; 
import  uploadOnCloudinary  from '../utils/cloudinary.js';
import asyncHandler from '../utils/asyncHandler.js';



// 2. Get All Categories with Hierarchy and Product Counts
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "parentCategory",
          as: "subcategories",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" },
        },
      },
      {
        $project: {
          products: 0, // Exclude product details to avoid heavy response
        },
      },
    ]);

    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
});

// 3. Get Category By ID with Subcategories and Products
// const getCategoryById = asyncHandler(async (req, res) => {
//     try {
//       const { categoryId } = req.params;
  
//       // Validate ObjectId
//       if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//         return res.status(400).json({ message: "Invalid category ID" });
//       }
  
//       const category = await Category.aggregate([
//         { $match: { _id: new mongoose.Types.ObjectId(categoryId) } },
//         {
//           $lookup: {
//             from: "categories", // Subcategories lookup
//             localField: "_id",
//             foreignField: "parentCategory",
//             as: "subcategories",
//           },
//         },
//         {
//           $lookup: {
//             from: "products", // Associated products lookup
//             localField: "_id",
//             foreignField: "category",
//             as: "products",
//           },
//         },
//       ]);
  
//       if (!category.length) {
//         return res.status(404).json({ message: "Category not found" });
//       }
  
//       res.status(200).json({ category: category[0] }); // Return the first (and only) match
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error fetching category", error: error.message });
//     }
//   });

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug }).lean();

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.status(200).json({ category });
});


const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(categoryId).lean();

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const totalProducts = await Product.countDocuments({ category: categoryId });

    const products = await Product.find({ category: categoryId })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      category,
      products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error: error.message });
  }
});




import slugify from "slugify";

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, parent: parentCategoryId } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required!" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Category image is required!" });
  }

  // Generate slug
  const slug = slugify(name, { lower: true, strict: true });

  // Check for slug uniqueness
  const existing = await Category.findOne({ slug });
  if (existing) {
    return res.status(400).json({ message: "Category with this name already exists!" });
  }

  // Upload image to Cloudinary
  const result = await uploadOnCloudinary(req.file.path);
  const imageUrl = result?.secure_url;
  if (!imageUrl) {
    return res.status(500).json({ message: "Image upload failed" });
  }

  let parent = null;
  let path = [];

  if (parentCategoryId && parentCategoryId !== "self") {
    const parentCategory = await Category.findById(parentCategoryId);
    if (!parentCategory) {
      return res.status(400).json({ message: "Invalid parent category ID" });
    }
    parent = parentCategory._id;
    path = [...parentCategory.path, parentCategory._id];
  }

  let category = new Category({
    name,
    slug,
    description,
    parent,
    path,
    image: imageUrl
  });

  await category.save();

  if (parentCategoryId === "self") {
    category.parent = category._id;
    category.path = [category._id];
    await category.save();
  }

  res.status(201).json({
    message: "Category created successfully",
    category
  });
});




 const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, parent: parentCategoryId, isActive } = req.body;
  const { categoryId } = req.params;

  let imageUrl;
  if (req.file) {
    const result = await uploadOnCloudinary(req.file.path);
    imageUrl = result?.secure_url;
    if (!imageUrl) {
      return res.status(500).json({ message: "Image upload failed" });
    }
  }

  // Validate parent category and build path
  let path = [];
  if (parentCategoryId) {
    const parentCategory = await Category.findById(parentCategoryId);
    if (!parentCategory) {
      return res.status(400).json({ message: "Invalid parent category ID" });
    }
    path = [...parentCategory.path, parentCategory._id];
  }

  const updates = {
    name,
    description,
    parent: parentCategoryId || null,
    path,
    isActive
  };

  if (imageUrl) updates.image = imageUrl;

  const updatedCategory = await Category.findByIdAndUpdate(categoryId, updates, {
    new: true,
    runValidators: true
  });

  if (!updatedCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.status(200).json({
    message: "Category updated successfully",
    category: updatedCategory
  });
});



 const softDeleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  // 1. Get all descendants
  const descendants = await getAllDescendantCategories(categoryId);
  const categoryIds = [categoryId, ...descendants.map(c => c._id)];

  // 2. Check if any products/services belong to these categories
  const products = await Product.find({ mainCategory: { $in: categoryIds } });
  const services = await Service.find({ mainCategory: { $in: categoryIds } });

  if (products.length > 0 || services.length > 0) {
    return res.status(400).json({
      message: "Cannot deactivate category tree with associated products or services",
      productsCount: products.length,
      servicesCount: services.length
    });
  }

  // 3. Soft delete category + subcategories
  await Category.updateMany(
    { _id: { $in: categoryIds } },
    { $set: { isActive: false } }
  );

  res.status(200).json({
    message: "Category and its subcategories deactivated successfully",
    deactivatedCategories: categoryIds
  });
});

// PUT /categories/:id/toggle-active
const toggleCategoryActive = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  category.isActive = !category.isActive;  // toggle
  await category.save();

  res.json(new ApiResponse(
    200,
    category,
    `Category ${category.isActive ? "activated" : "deactivated"} successfully`
  ));
});


export {
  toggleCategoryActive,
  softDeleteCategory,
  updateCategory,
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
};