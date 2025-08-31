// backend/src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import './config/passport';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import noteRoutes from './routes/note.routes';

dotenv.config();
connectDB();

const app = express();

// Use CORS - Adjust origin for production
app.use(cors({ origin: '*' })); 
app.use(express.json());

// Initialize Passport Middleware
app.use(passport.initialize());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);


export default app;