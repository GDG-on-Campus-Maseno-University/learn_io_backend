const Lesson = require('../models/lessonModels'); // Import the Lesson model

// Retrieve all lessons
exports.getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({ is_deleted: false });
        res.status(200).json({
            status: 'success',
            results: lessons.length,
            data: {
                lessons
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Retrieve a single lesson by ID
exports.getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findOne({ id: req.params.id, is_deleted: false });
        if (!lesson) {
            return res.status(404).json({
                status: 'fail',
                message: 'Lesson not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                lesson
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Create a new lesson
exports.createLesson = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newLesson = new Lesson({ title, description });
        await newLesson.save();
        res.status(201).json({
            status: 'success',
            data: {
                lesson: newLesson
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update an existing lesson by ID
exports.updateLesson = async (req, res) => {
    try {
        const { title, description } = req.body;
        const updatedLesson = await Lesson.findOneAndUpdate(
            { id: req.params.id, is_deleted: false },
            { title, description },
            { new: true, runValidators: true } // Return the updated document and run validators
        );
        if (!updatedLesson) {
            return res.status(404).json({
                status: 'fail',
                message: 'Lesson not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                lesson: updatedLesson
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete a lesson by ID (soft delete)
exports.deleteLesson = async (req, res) => {
    try {
        const deletedLesson = await Lesson.findOneAndUpdate(
            { id: req.params.id, is_deleted: false },
            { is_deleted: true },
            { new: true } // Return the updated document
        );
        if (!deletedLesson) {
            return res.status(404).json({
                status: 'fail',
                message: 'Lesson not found'
            });
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};