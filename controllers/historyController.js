// controllers/historyController.js

import History from "../models/History.js";


// get all user  history
export const getUserHistory = async (req, res) => {
    try {

        const userId = req.user._id;
        // get user history and order it by date
        const history = await History.findOne({ user: userId }).sort({ "predictions.date": -1 });
        res.status(200).json({ success: true, data: history });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
