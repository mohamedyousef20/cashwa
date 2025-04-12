import multer from "multer";
import createError from "../utils/error.js";


// upload single image
 const uploadSingleImg = (imageFile) => {
  console.log(imageFile)
    const multerStorage = multer.memoryStorage();
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true)
        }
        else {
            cb(new createError('accepting only image', 400, false))
        }
    }
    //@ CREATE  IMAGE DESTINATION 
    const upload = multer({ storage: multerStorage, fileFilter: multerFilter })




    //@ CREATE IMAGE 
    return upload.single(imageFile);


};


export default uploadSingleImg





