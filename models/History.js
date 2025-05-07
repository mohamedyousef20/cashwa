import mongoose from 'mongoose';

const uploadHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    detectionResults: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('UploadHistory', uploadHistorySchema);