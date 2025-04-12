import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    symptoms: {
        type: [String],
        required: true,
    },
    treatment: {
        type: [String],
        required: true,
    }
}, { timestamps: true });

const Disease = mongoose.model('Disease', diseaseSchema);

export default Disease;
