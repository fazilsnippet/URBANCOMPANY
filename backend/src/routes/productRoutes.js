import express from "express"
import {getRelatedProducts, getRecentProducts, getTopSellingProducts , getProducts, getAllProducts, getProductById } from "../controllers/productController"


const productRouter =express.Router();

productRouter.get("/", getProducts)
productRouter.get("/all", getAllProducts)

productRouter.get("/recentproducts", getRecentProducts)
productRouter.get("/topselling", getTopSellingProducts)
productRouter.get("/:productId", getProductById)
productRouter.get("/:productId" , getRelatedProducts)

export default productRouter