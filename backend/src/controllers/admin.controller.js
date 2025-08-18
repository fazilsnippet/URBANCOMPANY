import { Category } from "../models/Category.model.js";
import { Product } from "../models/product.model";
import { Service } from "../models/service.model";

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory, isActive } = req.body;
const image = req.files
  try {
    // Validate Parent Category
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(400).json({ message: "Invalid parent category" });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      { name, description, parentCategory, isActive , image},
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
});

// Recursive function to gather all descendant categories
async function getAllDescendantCategories(categoryId) {
  const categories = await Category.find({ parentCategory: categoryId });
  let all = [...categories];

  for (let cat of categories) {
    const descendants = await getAllDescendantCategories(cat._id);
    all = all.concat(descendants);
  }

  return all;
}

export const softDeleteCategory = asyncHandler(async (req, res) => {
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



 export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required!" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Category image is required!" });
  }

  // Upload image to Cloudinary
  const imageUrl = await uploadOnCloudinary(req.file.path);
  if (!imageUrl) {
    return res.status(500).json({ message: "Image upload failed" });
  }

  // Check if parent category is valid
  let parent = null;
  if (parentCategory) {
    const parentExists = await Category.findById(parentCategory);
    if (!parentExists) {
      return res.status(400).json({ message: "Invalid parent category ID" });
    }
    parent = parentCategory;
  }

  const category = new Category({
    name,
    image: imageUrl, // ✅ Save Cloudinary image URL
    description,
    parentCategory: parent || null,
  });

  await category.save();

  res.status(201).json({
    message: "Category created successfully",
    category,
  });
});