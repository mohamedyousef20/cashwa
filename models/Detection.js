// Detection Schema (models/Detection.js)
import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    detections: [{
        bbox: {
            xmax: Number,
            xmin: Number,
            ymax: Number,
            ymin: Number
        },
        class: {
            type: String,
            required: true
        },
        confidence: {
            type: Number,
            required: true
        }
    }],
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual for image URL
detectionSchema.virtual('imageUrl').get(function () {
    return `${process.env.BASE_URL}/uploads/${this.image}`;
});

// Ensure virtuals are included in toJSON output
detectionSchema.set('toJSON', { virtuals: true });

export default mongoose.model("Detection", detectionSchema);