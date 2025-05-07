import asyncHandler from "express-async-handler";
import crypto from "crypto";
import Jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail/sendEmail.js";
import User from "../models/User.js";
import createError from "../utils/error.js";

// =========================================
// @desc    Send reset code to user's email
// @route   POST /api/v/auth/forgot-password
// @access  Public
// =========================================
export const forgetPassword = asyncHandler(async (req, res, next) => {
    console.log(req.body.email);

    // 1. Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new createError(`No User Match This Email ${req.body.email}`, 404));
    }

    // 2. Generate 5-digit random code and hash it
    const randomCode = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
    const hashedRandomCode = crypto.createHmac("sha256", process.env.JWT_SECRET_KEY)
        .update(randomCode)
        .digest("hex");

    // 3. Save hashed code and expiration to user
    user.passwordRestCode = hashedRandomCode;
    user.passwordRestCodeExpire = Date.now() + 5 * 60 * 1000; // Valid for 5 minutes
    user.passwordRestVerified = false;
    await user.save();

    // 4. Send code via email
    try {
        const message = `
Hi ${user.username},

We received a request to reset your password. Please use the verification code below to complete the process:

================================
**Your OTP:**  ${randomCode}
================================

This code is valid for the next 5 minutes. If you did not request a password reset, please ignore this email.

Thanks,  
The Support Team
`;

        await sendEmail({
            email: user.email,
            subject: "Your Reset Code (Valid For 5 Minutes)",
            message,
        });
    } catch (err) {
        // On error, clean up user's reset info
        user.passwordRestCode = undefined;
        user.passwordRestCodeExpire = undefined;
        user.passwordRestVerified = undefined;
        await user.save();
        return next(new createError(err.message, 500));
    }

    res.status(201).json({ message: "Code sent to email" });
});

// =========================================
// @desc    Verify the reset code (OTP)
// @route   POST /api/v/auth/verify-reset-code
// @access  Public
// =========================================
export const verifyResetCode = asyncHandler(async (req, res, next) => {
    const hashedResetCode = crypto.createHmac("sha256", process.env.JWT_SECRET_KEY)
        .update(req.body.resetCode)
        .digest("hex");

    // Find user with valid, non-expired reset code
    const user = await User.findOne({
        passwordRestCode: hashedResetCode,
        passwordRestCodeExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new createError("Invalid or expired reset code, please try again", 501));
    }

    user.passwordRestVerified = true;
    await user.save();

    res.status(201).json({ message: "Valid reset code" });
});

// =========================================
// @desc    Reset password after code verified
// @route   POST /api/v/auth/reset-password
// @access  Public
// =========================================
export const resetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new createError("No user matches this email", 404));
    }

    if (!user.passwordRestVerified) {
        return next(new createError("Reset code was not verified", 501));
    }

    // Reset password and clear reset fields
    user.password = req.body.newPassword;
    user.passwordRestCode = undefined;
    user.passwordRestCodeExpire = undefined;
    user.passwordRestVerified = undefined;
    await user.save();

    // Generate new JWT
    const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_DATE,
    });

    res.status(200).json({ data: user, userToken: token });
});
