// config/dataBase.js
import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to DB");
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
};

export default dbConnect;
