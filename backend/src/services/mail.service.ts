// backend/src/services/mail.service.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
console.log("Email Transporter Configured:" ,process.env.SENDER_EMAIL)
console.log("Email Host:" ,process.env.EMAIL_HOST)
console.log("Email Port:" ,process.env.EMAIL_PORT)
console.log("Email User:" ,process.env.EMAIL_USER)

// Function to send OTP email   
export const sendOTPEmail = async (to: string, otp: string) => {
    const mailOptions = {
        from: `"NoteHD" <${process.env.SENDER_EMAIL}>`,
        to,
        subject: 'Your OTP for NoteHD',
        text: `Your One-Time Password is: ${otp}. It is valid for 10 minutes.`,
        html: `<b>Your One-Time Password is: ${otp}</b>. It is valid for 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Could not send OTP email.');
    }
};