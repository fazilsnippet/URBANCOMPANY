import express from 'express'
import { verifyUser } from "../middlewares/authMiddleware.js";  // Assuming you have an auth middleware to verify JWT token
import {getBookingDetails, createBooking, cancelBooking} from "../controllers/bookingController.js"
const bookingRoutes = express.Router();

bookingRoutes.post("/booking/create", verifyUser, createBooking)
bookingRoutes.get("/booking/:bookingId", verifyUser , getBookingDetails)
bookingRoutes.patch("/booking/:bookingId/cancel", verifyUser , cancelBooking)

export default bookingRoutes