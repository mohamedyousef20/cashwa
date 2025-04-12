import Disease from '../models/Disease.js';

export const createDisease = async (req, res) => {
    try {
        const newDisease = await Disease.create(req.body);
        res.status(201).json({ success: true, data: newDisease });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// export const getDiseases = async (req, res) => {
//     try {
//         const diseases = await Disease.find({});
//         res.status(200).json({ success: true, data: diseases });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

// export const getDisease = (result) => {
//     async (req, res) => {
//         try {
//             // Extract the disease name from the request body
//             // const { name } = req.body;
//             // console.log('req.body =>>>>>>>>>>>>>', req.body)
//             // // Validate that the name is provided
//             // if (!name) {
//             //     return res.status(400).json({ success: false, error: 'Disease name is required' });
//             // }

//             // Find the disease in the database by its name
//             const disease = await Disease.findOne({ name: result });
//             if (!disease) {
//                 return res.status(404).json({ success: false, error: 'لم يتم العثور على المرض' });
//             }

//             // Return the full disease details
//             res.status(200).json({ success: true, data: disease });
//         } catch (err) {
//             res.status(500).json({ success: false, error: err.message });
//         }
//     };

// }
export const updateDisease = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDisease = await Disease.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDisease) {
            return res.status(404).json({ success: false, error: 'لم يتم العثور على المرض' });
        }
        res.status(200).json({ success: true, data: updatedDisease });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

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
