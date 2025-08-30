// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import User from '../models/user.model';
import { sendOTPEmail } from '../services/mail.service';
import jwt from 'jsonwebtoken';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. Handle Sign Up Request (Sends OTP)
export const signup = async (req: Request, res: Response) => {
    const { name, email, dateOfBirth } = req.body;

    if (!name || !email || !dateOfBirth) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Temporarily store user info with OTP
        // A better approach for production would be a separate temporary collection
        user = new User({ name, email, dateOfBirth, otp, otpExpires });
        await user.save();

        await sendOTPEmail(email, otp);
        res.status(200).json({ message: 'OTP sent to your email. Please verify.' });
    } catch (error) {
         console.error("Error in /signup route:", error);
        res.status(500).json({ message: 'Server error during signup.' });
    }
};

// 2. Verify OTP and Create User
export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found. Please sign up again.' });
        }

        if (user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // Clear OTP fields after verification
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate JWT
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '3d' });

        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error during OTP verification.' });
    }
};

// 3. Handle Sign In Request (Sends OTP)
export const signin = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User with this email does not exist.' });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        await sendOTPEmail(email, otp);
        
        
        res.status(200).json({ message: 'OTP sent to your email for login.' });
    } catch (error) {
        console.error("Error in /signin route:", error);
        res.status(500).json({ message: 'Server error during signin.' });
    }
};

// Note: The verifyOtp function can be reused for sign-in as well. 
// We just need a separate route pointing to it.