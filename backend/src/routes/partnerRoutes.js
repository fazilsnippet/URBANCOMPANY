import express from 'express'
import  {deletePartnerProfile, getAllPartnerProfiles, getPartnerProfileById, updatePartnerProfile,createPartnerProfile, togglePartnerActive} from "../controllers/partnerController.js"
import {verifyPartner, verifyUser} from "../middlewares/authMiddleware.js"

const partnerRoutes = express.Router();


partnerRoutes.get("/:partnerId" , getPartnerProfileById )
partnerRoutes.post("/create",verifyUser, createPartnerProfile)

export default partnerRoutes