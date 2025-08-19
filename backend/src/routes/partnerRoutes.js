import express from 'express'
import  {deletePartnerProfile, getAllPartnerProfiles, getPartnerProfileById, updatePartnerProfile,createPartnerProfile, togglePartnerActive} from "../controllers/partnerController.js"
import {verifyPartner} from "../middlewares/authMiddleware.js"

const partnerRoutes = express.Router();


partnerRoutes.get("/:partnerId",verifyPartner , getPartnerProfileById )
partnerRoutes.post("/create", createPartnerProfile)

export default partnerRoutes