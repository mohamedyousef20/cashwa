import sharp from "sharp";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import fs from "fs";
import Jwt from "jsonwebtoken";
import User from "../models/User.js";
import createError from "../utils/error.js";
import uploadSingleImg from "../middleware/uploadImages.js";

// ===============================
// Middleware to Upload Profile Image
// ===============================
export const createUserImg = uploadSingleImg("profileImage");

// ===============================
// Resize and Save Profile Image
// ===============================
export const resizeImage = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `user-${Date.now()}-${Math.floor(Math.random() * 10000)}.jpeg`;

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/${fileName}`);

        req.body.profileImage = fileName;
    }
    next();
});

// ===============================
// Get Logged-In User Profile
// ===============================
export const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new createError("Session Timeout. Please log in again.", 404));
    }

    res.json({ msg: "success", data: user });
});

// ===============================
// Change Password (Admin Access)
// ===============================
export const changeUserPassword = asyncHandler(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.newPassword, 10),
            passwordChangeAt: Date.now(),
        },
        { new: true }
    );

    if (!updatedUser) {
        return next(new createError("No document found to update", 404));
    }

    res.status(200).send(updatedUser);
});

// ===============================
// Change Logged-In User Password
// ===============================
export const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcrypt.hash(req.body.newPassword, 10),
            passwordChangeAt: Date.now(),
        },
        { new: true }
    );

    const token = Jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE_DATE }
    );

    res.status(201).json({ data: updatedUser, userToken: token });
});

// ===============================
// Update Logged-In User Profile
// ===============================
export const updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.profileImage) user.profileImage = req.body.profileImage;

    const updatedUser = await user.save();

    res.status(200).json({
        status: "success",
        data: updatedUser,
    });
});

// ===============================
// Delete Logged-In User
// ===============================
export const deleteMyAccount = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.user._id);
    res.status(201).send("Deleting your account was successful.");
});
