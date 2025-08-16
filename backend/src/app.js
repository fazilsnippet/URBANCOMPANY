import express from 'express';
import cors from 'cors';

import cookieParser from 'cookie-parser';  
import errorHandler from './middlewares/error.middleware.js';
import dotenv from 'dotenv'; 
import userRoutes from './routes/userRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import payoutRoutes from './routes/payoutRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';





dotenv.config(); 

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173", 
        credentials: true,
    })
);

app.use(express.json()); 


app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());  

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use(errorHandler);

export default app;
