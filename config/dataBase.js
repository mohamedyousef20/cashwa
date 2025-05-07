// config/dataBase.js
import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        console.log('process.env.DB_URI', process.env.DB_URI)
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to DB");
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
};

export default dbConnect;
