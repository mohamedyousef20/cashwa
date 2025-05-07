import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import cors from 'cors';
import dbConnect from './config/dataBase.js';
import mountRoutes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import { trusted } from "mongoose";

dotenv.config();

// Create Express app
const app = express();

// Database connection
dbConnect();

// Configure directories
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('trust proxy', true); 

// Middleware
app.use(cors());
app.use(express.json({ limit: "120kb" }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later"
});

app.use("/api", limiter);

// Routes
mountRoutes(app);

// Error handler 
app.use(errorHandler);  

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", {
        message: err.message,
        stack: err.stack
    });
    server.close(() => process.exit(1));
});