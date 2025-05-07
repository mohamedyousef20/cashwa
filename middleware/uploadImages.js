import multer from "multer";
import createError from "../utils/error.js";

const uploadSingleImg = (imageFile) => {
    const multerStorage = multer.memoryStorage();
    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(null, false); // Reject non-image files cleanly
        }
    };

    const upload = multer({
        storage: multerStorage,
        fileFilter: multerFilter
    });

    return upload.single(imageFile);
};

export default uploadSingleImg;