import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    predictions: [{
        imageUrl: String,
        rawPrediction: String,
        date: { type: Date, default: Date.now }
    }]
});
const History = mongoose.model('History', historySchema);

export default History;
