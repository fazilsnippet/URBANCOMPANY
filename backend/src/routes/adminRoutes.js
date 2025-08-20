import express from "express";
import { upload } from "../middlewares/multer.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

// Partner Controllers
import {
  createPartnerProfile,
  getPartnerProfileById,
  getAllPartnerProfiles,
  updatePartnerProfile,
  togglePartnerActive,
  deletePartnerProfile,
} from "../controllers/partnerController.js";

// Booking Controllers
import {
  getAllBookingsAdmin,
  getBookingByIdAdmin,
} from "../controllers/bookingController.js";

// Product Controllers
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

// Service Controllers
import {
  createService,
  updateService,
  deleteService,
  toggleServiceActive,
  getAllServices,
} from "../controllers/serviceController.js";

//Category Controllers
import {
    createCategory,
    softDeleteCategory,
    updateCategory,
    toggleCategoryActive,
    getAllCategories
} from "../controllers/categoryController.js"
const adminRoutes = express.Router();

// adminRoutes.use(verifyAdmin);

/* ------------------------- PARTNER ROUTES ------------------------- */
adminRoutes.get("/partner/all", getAllPartnerProfiles);
adminRoutes.post("/partner/create", upload.single("avatar"), createPartnerProfile);
adminRoutes.get("/partner/:partnerId", getPartnerProfileById);
adminRoutes.patch("/partner/:partnerId/update", upload.single("avatar"), updatePartnerProfile);
adminRoutes.patch("/partner/:partnerId/toggle", togglePartnerActive);
adminRoutes.delete("/partner/:partnerId/delete", deletePartnerProfile);

/* ------------------------- SERVICE ROUTES ------------------------- */
adminRoutes.get("/service/all", getAllServices);
adminRoutes.post("/service/create", upload.array("images", 10), createService);
adminRoutes.patch("/service/:serviceId/update", upload.array("images", 10), updateService);
adminRoutes.patch("/service/:serviceId/toggle", toggleServiceActive);
adminRoutes.delete("/service/:serviceId/delete", deleteService);

/* ------------------------- PRODUCT ROUTES ------------------------- */
adminRoutes.post("/product/create", upload.array("images", 10), createProduct);
adminRoutes.patch("/product/:productId/update", upload.array("images", 10), updateProduct);
adminRoutes.delete("/product/:productId/delete", deleteProduct);

/* ------------------------- BOOKING ROUTES ------------------------- */
adminRoutes.get("/booking/all", getAllBookingsAdmin);
adminRoutes.get("/booking/:bookingId", getBookingByIdAdmin);

/* ------------------------- CATEGORY ROUTES ------------------------- */
adminRoutes.post("/category/create", upload.single("imageUrl"),createCategory);
adminRoutes.get("/category/all", getAllCategories);
adminRoutes.patch("/category/:categoryId/update", upload.single("imageUrl"), updateCategory);
adminRoutes.patch("/category/:categoryId/active", toggleCategoryActive);



export default adminRoutes;
