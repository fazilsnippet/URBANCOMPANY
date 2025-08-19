import express from 'express'
import  {createService, getServiceById, getAllServices, getServicesByCategory, deleteService, updateService, toggleServiceActive} from "../controllers/serviceController.js"
const serviceRouter = express.Router();
//add admin middleware 
serviceRouter.get("/all", getAllServices)
serviceRouter.get("/:serviceId", getServiceById)
serviceRouter.get("/:categoryId", getServicesByCategory)



export default serviceRouter