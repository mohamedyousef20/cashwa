import sharp from "sharp"
import asyncHandler from "express-async-handler"
import bcrypt from 'bcrypt'
import fs from 'fs';
import Jwt from "jsonwebtoken"
import User from "../models/User.js"
import createError from "../utils/error.js"
import uploadSingleImg from "../middleware/uploadImages.js"

// import { uploadSingleImg } from "../middleware/uploadImage.js"


//@ CREATE USER PROFILE IMAGE FUNCTION
export const createUserImg = uploadSingleImg("profileImage")
//@ CREATE  IMAGE PROCESSING FUNCTION
export const resizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `user${Math.random(100)}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer).resize(500, 500).toFormat("jpeg").jpeg({ quality: 90 }).toFile(`uploads/user/${fileName}`);
        req.body.profileImage = fileName;
    }

    next();

})
//@ CREATE ALL USER
//@ ROUTES => POST => api/v/user
//@ ACCESS => ADMIN
// export const createUser = createOne(User);


//@ GET ALL USER
//@ ROUTES => GET => api/v/user
//@ ACCESS => ADMIN


export const getUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new createError('Session Timeout Please Login Again', 404))

    }
    res.json({ msg: "success", data: user })
})
//@ UPDATE SPECIFIC USER
//@ ROUTES => PUT  => api/vi/user/
//@ ACCESS => ADMIN

// export const updateUser = asyncHandler(async (req, res, next) => {
//     const updateOne = await User.findByIdAndUpdate(
//         { _id: req.params.id },

//         {
//             name: req.body.name,
//             slug: req.body.slug,
//             email: req.body.email,
//             profileImage: req.body.profileImage,
//             phone: req.body.phone
//         },

//         { new: true }

//     );
//     if (!updateOne) {
//         return next(new createError(`No documents Found TO Update`, 404))
//     }
//     res.status(200).send(updateOne);
// });

//@ UPDATE SPECIFIC USER 
//@ ROUTES => PUT  => api/vi/user/
//@ ACCESS => ADMIN

export const changeUserPassword = asyncHandler(async (req, res, next) => {
    const updateOne = await User.findByIdAndUpdate(
        { _id: req.params.id },

        {
            password: await bcrypt.hash(req.body.newPassword, 10),
            passwordChangeAt: Date.now()
        },

        { new: true }

    );
    if (!updateOne) {
        return next(new createError(`No documents Found TO Update`, 404))
    }
    res.status(200).send(updateOne);
});

//@ DELETE  User
//@ ROUTES => DELETE => api/vi/User/:id
//@ ACCESS => ADMIN
// export const deleteUser = deleteOne(User);
//@ GET LOGGED User
//@ ROUTES => DELETE => api/vi/user/getData/getMe
//@ ACCESS => LOGGED USER

//@ GET LOGGED User
//@ ROUTES => DELETE => api/vi/user/getData/getMe
//@ ACCESS => LOGGED USER

export const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    const updateOne = await User.findByIdAndUpdate(
        { _id: req.user._id },


        {
            password: await bcrypt.hash(req.body.newPassword, 10),
            passwordChangeAt: Date.now()
        },

        { new: true }

    );
    const token = Jwt.sign({
        id: req.user._id

    }, process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE_DATE });

    res.status(201).json({ data: updateOne, userToken: token })
});

export const updateLoggedUserData = asyncHandler(async (req, res, next) => {
    // Get the current user
    const user = await User.findById(req.user._id);

    // Update fields
    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;

    // Handle image upload
    if (req.file) {
        // Store the new image path temporarily
        user.profileImage = req.body.profileImage;
    }

    // Save the user (this will trigger the pre-save hook)
    const updatedUser = await user.save();
    res.status(200).json({
        status: 'success',
        data: updatedUser
    });
});
// // deactivate logged user


// delete logged user
export const deleteMyAccount = asyncHandler(async (req, res, next) => {

    await User.findByIdAndDelete({ _id: req.user._id })
    res.status(201).send("Deleting Your Account Is Done Successfully.....")

}
)