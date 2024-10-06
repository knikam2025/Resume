const CV = require("../models/cv");

// Create a new CV
exports.createCV = async (req, res) => {
    try {
        const { layout, basicDetails, education, experience, projects, skills, socialProfiles } = req.body;

        const newCV = new CV({
            user: req.userId,  
            layout,
            basicDetails: { ...basicDetails },
            education,
            experience,
            projects,
            skills,
            socialProfiles,
        });

        
        await newCV.save();

        res.status(201).json({
            success: true,
            message: "CV created successfully!",
            data: newCV,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all CVs for the logged-in user
exports.getAllCVs = async (req, res) => {
    try {
        
        const cvs = await CV.find({ user: req.userId });

        res.status(200).json({
            success: true,
            data: cvs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a specific CV by ID, but only if it belongs to the logged-in user
exports.getCVById = async (req, res) => {
    try {
        
        const cv = await CV.findOne({ _id: req.params.id, user: req.userId });

        if (!cv) {
            return res.status(404).json({ success: false, message: "CV not found or not authorized" });
        }

        res.status(200).json({
            success: true,
            data: cv,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a CV by ID, but only if it belongs to the logged-in user
exports.updateCV = async (req, res) => {
    try {
        const { layout, basicDetails, education, experience, projects, skills, socialProfiles } = req.body;

        const updateData = {
            layout,
            basicDetails: {
                ...basicDetails,
                imageUrl: req.file ? req.file.path : undefined,
            },
            education,
            experience,
            projects,
            skills,
            socialProfiles,
        };




        const cv = await CV.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            updateData,
            { new: true }
        );

        if (!cv) {
            return res.status(404).json({ success: false, message: "CV not found or not authorized" });
        }

        res.status(200).json({
            success: true,
            message: "CV updated successfully!",
            data: cv,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};



exports.deleteCV = async (req, res) => {
    try {

        const cv = await CV.findOneAndDelete({ _id: req.params.id, user: req.userId });

        if (!cv) {
            return res.status(404).json({ success: false, message: "CV not found or not authorized" });
        }

        res.status(200).json({
            success: true,
            message: "CV deleted successfully!",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
