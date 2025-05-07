// controllers/historyController.js

import Detection from "../models/Detection.js";

// ==============================================
// @desc    Get all detection history for a user
// @route   GET /api/v/history
// @access  Private (Requires Auth)
// ==============================================
export const getUserHistory = async (req, res) => {
    try {
        // Get logged-in user's ID from request (set in middleware)
        const userId = req.user._id;

        // Fetch all detections by user, sorted by latest first
        const history = await Detection.find({ user: userId }).sort({ createdAt: -1 });

        // Get total count of user's detections
        const count = await Detection.countDocuments({ user: userId });

        // Return data and count
        res.status(200).json({
            success: true,
            count: count,
            data: history
        });
    } catch (err) {
        // Handle unexpected errors
        res.status(500).json({ success: false, error: err.message });
    }
};
