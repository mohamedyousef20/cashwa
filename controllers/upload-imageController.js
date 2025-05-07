// controllers/upload-imageController.js

import FormData from 'form-data';
import fetch from 'node-fetch';
import createError from '../utils/error.js';
import Detection from '../models/Detection.js';
import expressAsyncHandler from 'express-async-handler';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import uploadSingleImg from '../middleware/uploadImages.js';

// ==========================
// Create Upload Directory
// ==========================
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ==========================
// Middleware to Handle Upload
// ==========================
export const createDetectImg = uploadSingleImg("image");

// ==========================
// Resize Image with Sharp
// ==========================
export const resizeImage = expressAsyncHandler(async (req, res, next) => {
    if (!req.file) return next();

    try {
        const fileName = `img-${Date.now()}-${Math.floor(Math.random() * 10000)}.jpeg`;

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(path.join(uploadDir, fileName));

        // Attach filename to request body
        req.body.image = fileName;
        next();
    } catch (error) {
        next(error);
    }
});

// ==========================
// Upload Image & Detect Disease
// ==========================
const uploadImage = async (req, res, next) => {
    try {
        if (!req.file || !req.body.image) {
            throw new createError("No image uploaded or processing failed", 400);
        }

        // Send image to YOLO Flask API
        const form = new FormData();
        form.append('image', req.file.buffer, {
            filename: req.body.image, // Processed filename from sharp
            contentType: req.file.mimetype,
        });

        const flaskResponse = await fetch('http://18.207.164.139:8080/detect', {
            method: 'POST',
            body: form,
            headers: form.getHeaders(),
            timeout: 300000 // 5 minutes
        });

        if (!flaskResponse.ok) {
            const errorData = await flaskResponse.json();
            throw new createError(`Flask API Error: ${errorData.message}`, flaskResponse.status);
        }

        const detectionResult = await flaskResponse.json();

        // Save detection in MongoDB
        const detection = await Detection.create({
            user: req.user.id,
            detections: detectionResult.detections,
            image: req.body.image,
        });

        res.status(200).json({
            status: 'success',
            data: {
                detection,
                imageUrl: detection.imageUrl, // make sure you have a virtual or actual field for this
            },
        });
    } catch (error) {
        next(error);
    }
};

export default uploadImage;
