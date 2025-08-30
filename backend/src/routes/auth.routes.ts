import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { signup, verifyOtp, signin } from '../controllers/auth.controller';
import { IUser } from '../models/user.model';
import { protect } from '../middleware/auth.middleware'; // <-- Import the protect middleware
import User from '../models/user.model'; // <-- Import the User model

const router = Router();

// ===== Email & OTP Authentication Routes =====
router.post('/signup', signup);
router.post('/verify', verifyOtp);
router.post('/signin', signin);


// ===== Google OAuth 2.0 Authentication Routes =====
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/signin', session: false }),
    (req, res) => {
        const user = req.user as IUser;
        const payload = {
            user: {
                id: user.id,
            },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '3d' });
        res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    }
);


// ===== Get Current User Route (NEWLY ADDED) =====

/**
 * @route   GET /api/auth/me
 * @desc    Get the current logged-in user's data based on their token
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
     try {
        // --- THIS IS THE FIX ---
        // First, we check if req.user exists. This makes TypeScript happy
        // because it knows that inside this 'if' block, req.user is guaranteed to be defined.
        if (req.user) {
            const user = await User.findById(req.user.id).select('-otp -otpExpires');

            if (!user) {
                return res.status(404).json({ message: 'User not found in database' });
            }
            
            // Send the user data back to the frontend
            res.json(user);
        } else {
            // This case should technically never be reached if 'protect' middleware is working,
            // but it's good practice to handle it.
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
    } catch (error) {
        console.error("Error fetching user for /me route:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});


export default router;