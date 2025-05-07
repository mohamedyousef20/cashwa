import Disease from '../models/Disease.js';

// ================================
// CREATE NEW DISEASE ENTRY
// ROUTE: POST /api/diseases
// ACCESS: Public or Protected 
// ================================
export const createDisease = async (req, res) => {
    try {
        const newDisease = await Disease.create(req.body);
        res.status(201).json({ success: true, data: newDisease });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ================================
// GET ALL DISEASES
// ROUTE: GET /api/diseases
// ACCESS: Public or Protected
// ================================
export const getDiseases = async (req, res) => {
    try {
        const diseases = await Disease.find({});
        res.status(200).json({ success: true, data: diseases });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ================================
// GET A SINGLE DISEASE BY NAME
// USAGE: Used in internal logic, not as route handler directly
// Should be used like: getDisease(diseaseName)(req, res)
// ================================
export const getDisease = (result) => async (req, res) => {
    try {
        // Search for disease by name
        const disease = await Disease.findOne({ name: result });

        if (!disease) {
            return res.status(404).json({ success: false, error: 'لم يتم العثور على المرض' });
        }

        res.status(200).json({ success: true, data: disease });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ================================
// UPDATE A DISEASE BY ID
// ROUTE: PUT /api/diseases/:id
// ACCESS: Admin or Authorized
// ================================
export const updateDisease = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedDisease = await Disease.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated document
        });

        if (!updatedDisease) {
            return res.status(404).json({ success: false, error: 'لم يتم العثور على المرض' });
        }

        res.status(200).json({ success: true, data: updatedDisease });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ================================
// DELETE A DISEASE BY ID
// ROUTE: DELETE /api/diseases/:id
// ACCESS: Admin or Authorized
// ================================
export const deleteDisease = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDisease = await Disease.findByIdAndDelete(id);

        if (!deletedDisease) {
            return res.status(404).json({ success: false, error: 'لم يتم العثور على المرض' });
        }

        res.status(200).json({ success: true, data: deletedDisease });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
