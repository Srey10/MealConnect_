import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import menuItemRoutes from './routes/menuItemRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import pickupRoutes from './routes/pickupRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import partnershipRoutes from './routes/partnershipRoutes.js';
import donationRoutes from './routes/donationRoutes.js';

dotenv.config();
const app = express();

// Connect to database
connectDB();

// ----------------- CORS FIX -----------------
const express = require('express');
const cors = require('cors');
const app = express();

// Allow your deployed frontend
const allowedOrigins = [
  'https://mealconnect-ngoconnect.onrender.com', // your frontend URL
  'http://localhost:5173' // optional: local frontend for dev
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow non-browser tools
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // if you use cookies
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// API Routes (ensure all start with /api)
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/partnerships', partnershipRoutes);
app.use('/api/donations', donationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Static uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

