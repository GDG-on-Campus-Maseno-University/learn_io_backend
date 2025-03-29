const Lesson = require('../models/papersModels'); // Assuming you have a Lesson model
const fs = require('fs');
const path = require('path');

/**
 * @desc Get all lessons
 * @route GET /api/lessons
 * @access Private (Authenticated users)
 */
exports.getAllLessons = async(req, res) => {
    try {
        const lessons = await Lesson.find({ deleted: false }); // Exclude soft-deleted lessons
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * @desc Get a single lesson by ID
 * @route GET /api/lessons/:id
 * @access Private
 */
exports.getLessonById = async(req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson || lesson.deleted) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * @desc Create a new lesson
 * @route POST /api/lessons
 * @access Private (Admin/Staff)
 */
exports.createLesson = async(req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const newLesson = new Lesson({
            title,
            description,
            file: req.file ? req.file.path : null, // Store file path if uploaded
        });

        await newLesson.save();
        res.status(201).json({ message: 'Lesson created successfully', lesson: newLesson });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * @desc Update a lesson
 * @route PUT /api/lessons/:id
 * @access Private (Admin/Staff)
 */
exports.updateLesson = async(req, res) => {
    try {
        const { title, description } = req.body;
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson || lesson.deleted) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Delete old file if new one is uploaded
        if (req.file && lesson.file) {
            fs.unlinkSync(path.resolve(lesson.file));
        }

        lesson.title = title || lesson.title;
        lesson.description = description || lesson.description;
        lesson.file = req.file ? req.file.path : lesson.file;

        await lesson.save();
        res.status(200).json({ message: 'Lesson updated successfully', lesson });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * @desc Soft delete a lesson
 * @route DELETE /api/lessons/:id
 * @access Private (Admin/Staff)
 */
exports.deleteLesson = async(req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson || lesson.deleted) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        lesson.deleted = true;
        await lesson.save();
        res.status(204).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};