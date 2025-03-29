const Papers = require('../models/papersModels'); // Assuming you have a Papers model
const fs = require('fs');
const path = require('path');

/**
 * @desc Get all Papers
 * @route GET /api/Papers
 * @access Private (Authenticated users)
 */
exports.getAllPapers = async(req, res) => {
    try {
        const Papers = await Papers.find({ deleted: false }); // Exclude soft-deleted Papers
        res.status(200).json(Papers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * @desc Get a single Papers by ID
 * @route GET /api/Papers/:id
 * @access Private
 */
exports.getPapersById = async(req, res) => {
    try {
        const Papers = await Papers.findById(req.params.id);
        if (!Papers || Papers.deleted) {
            return res.status(404).json({ message: 'Papers not found' });
        }
        res.status(200).json(Papers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * @desc Create a new Papers
 * @route POST /api/Papers
 * @access Private (Admin/Staff)
 */
exports.createPapers = async(req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const newPapers = new Papers({
            title,
            description,
            file: req.file ? req.file.path : null, // Store file path if uploaded
        });

        await newPapers.save();
        res.status(201).json({ message: 'Papers created successfully', Papers: newPapers });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * @desc Update a Papers
 * @route PUT /api/Papers/:id
 * @access Private (Admin/Staff)
 */
exports.updatePapers = async(req, res) => {
    try {
        const { title, description } = req.body;
        const Papers = await Papers.findById(req.params.id);

        if (!Papers || Papers.deleted) {
            return res.status(404).json({ message: 'Papers not found' });
        }

        // Delete old file if new one is uploaded
        if (req.file && Papers.file) {
            fs.unlinkSync(path.resolve(Papers.file));
        }

        Papers.title = title || Papers.title;
        Papers.description = description || Papers.description;
        Papers.file = req.file ? req.file.path : Papers.file;

        await Papers.save();
        res.status(200).json({ message: 'Papers updated successfully', Papers });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * @desc Soft delete a Papers
 * @route DELETE /api/Papers/:id
 * @access Private (Admin/Staff)
 */
exports.deletePapers = async(req, res) => {
    try {
        const Papers = await Papers.findById(req.params.id);

        if (!Papers || Papers.deleted) {
            return res.status(404).json({ message: 'Papers not found' });
        }

        Papers.deleted = true;
        await Papers.save();
        res.status(204).json({ message: 'Papers deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};