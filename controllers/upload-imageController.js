import { spawn } from 'child_process';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import History from '../models/History.js';
import Disease from '../models/Disease.js';
import createError from '../utils/error.js';

// Simple in-memory cache for diseases
const diseaseCache = {};

const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        // Create a processed image path for the output file.
        const processedImagePath = path.join('uploads', `${Date.now()}-processed.jpeg`);

        // Process the image using Sharp from the in-memory buffer:
        await sharp(req.file.buffer)
            .resize(640, 640, {
                fit: sharp.fit.cover,
                position: 'center'
            })
            .jpeg({ quality: 90, mozjpeg: true })
            .toFile(processedImagePath);

        console.log(`Image processed and saved at: ${processedImagePath}`);

        // Determine the model script path.
        // Using environment variable override, else assume the YOLO script is in a sibling folder named "yolo-v9"
        const modelScriptPath = process.env.YOLO_SCRIPT_PATH ||
            path.join(process.cwd(), '../yolo-v9', 'yolov9.py');

        console.log(`Using model script at: ${modelScriptPath}`);

        // Spawn Python process for prediction using the processed image path
        const pythonProcess = spawn('python', [
            modelScriptPath,
            processedImagePath
        ]);

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
            return next(new createError('Model Error'));
        });

        pythonProcess.on('close', async (code) => {
            console.log(`Python script ended with code ${code}`);

            // Save user history
            try {
                const newPrediction = {
                    imageUrl: processedImagePath,
                    rawPrediction: result,
                    date: new Date()
                };

                console.log("newPrediction =>", newPrediction.rawPrediction);

                let userHistory = await History.findOne({ user: req.user._id });
                if (userHistory) {
                    userHistory.predictions.push(newPrediction);
                    await userHistory.save();
                } else {
                    userHistory = await History.create({
                        user: req.user._id,
                        predictions: [newPrediction]
                    });
                }
                console.log("User history updated:", userHistory);
            } catch (historyErr) {
                console.error("Error updating history:", historyErr);
                return next(new createError('Error updating history', 501));
            }

            // Clean up the processed image file after processing.
            fs.unlink(processedImagePath, (err) => {
                if (err) {
                    console.error(`Error deleting processed file: ${err}`);
                    return next(new createError('Error deleting processed file', 501));
                }
            });

            // Parse the model's response to extract the disease name.
            let diseaseName;
            try {
                console.log("The result is:", result);
                // Assuming the result is a JSON string with a "name" property.
                const parsedResult = JSON.parse(result.trim());
                diseaseName = parsedResult.name;
            } catch (parseErr) {
                console.error("Error parsing model result:", parseErr);
                return next(new createError('Error parsing model result', 501));
            }

            // Query the Disease collection for treatment info using caching.
            try {
                let disease;
                if (diseaseCache[diseaseName]) {
                    console.log('Using cached disease data');
                    disease = diseaseCache[diseaseName];
                } else {
                    disease = await Disease.findOne({ name: diseaseName });
                    if (!disease) {
                        return next(new createError('Disease not found', 404));
                    }
                    diseaseCache[diseaseName] = disease;
                }
                return res.status(200).json({
                    success: true,
                    data: { name: disease.name, symptoms: disease.symptoms, treatment: disease.treatment }
                });
            } catch (dbErr) {
                console.error("Database error:", dbErr);
                return next(createError('Database error', 501));
            }
        });
    } catch (error) {
        console.error(`Error processing image: ${error}`);
        return next(createError('Error processing image', 501));
    }
};

export default uploadImage;
