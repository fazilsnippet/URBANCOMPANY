import express from "express"
import { 
  getAllCategories,
  getCategoryById,
  getCategoryBySlug
} from "../controllers/categoryController.js"

const categoryRoutes =express.Router();

categoryRoutes.get("/all", getAllCategories)
categoryRoutes.get("/:categoryId", getCategoryById)
categoryRoutes.get("/slug/:slug", getCategoryBySlug);

export default categoryRoutes