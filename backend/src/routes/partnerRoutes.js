import express from 'express'
import  {deletePartnerProfile, getAllPartnerProfiles, getPartnerProfileById, updatePartnerProfile,createPartnerProfile, togglePartnerActive} from "../controllers/partnerController.js"
import {verifyPartner,  verifyAdmin} from "../middlewares/authMiddleware.js"

const partnerRoutes = express.Router();

partnerRoutes.delete("/:partnerId/delete",verifyAdmin,  deletePartnerProfile)
partnerRoutes.get("/all", verifyAdmin, getAllPartnerProfiles)
partnerRoutes.get("/:partnerId",verifyPartner , getPartnerProfileById )
partnerRoutes.patch("/:partnerId/update", verifyAdmin, updatePartnerProfile)
partnerRoutes.post("/create", createPartnerProfile)
partnerRoutes.put("/:partnerId" ,  verifyAdmin , togglePartnerActive)

export default partnerRoutes