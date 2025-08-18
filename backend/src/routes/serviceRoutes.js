import express from 'express'
import { verifyAdmin } from '../middlewares/authMiddleware.js';
import  {createService, getServiceById, getAllServices, getServicesByCategory, deleteService, updateService, toggleServiceActive} from "../controllers/serviceController.js"
const serviceRouter = express.Router();
//add admin middleware 
serviceRouter.post("/create", verifyAdmin, createService)
serviceRouter.get("/all", getAllServices)
serviceRouter.get("/:serviceId", getServiceById)
serviceRouter.get("/:categoryId", getServicesByCategory)
serviceRouter.delete("/delete/:serviceId", verifyAdmin, deleteService)
serviceRouter.put("/update/:serviceId", verifyAdmin,  updateService)
serviceRouter.patch("/toggle/:serviceId", verifyAdmin,  toggleServiceActive)


export default serviceRouter