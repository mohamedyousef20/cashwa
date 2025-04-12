const mongoose = require("mongoose");

// create schema
const schema = new mongoose.Schema({
  

    image: {
        type: String,
        required: true
    },




}, { timestamps: true });




// create and export model
export default mongoose.model('Brand', BrandSchema)

