const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const lessonSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title for the lesson']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for the lesson']
    },
    file: {
        type: String, // This will store the file path or URL
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

// Middleware to update the updatedAt field before saving
lessonSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Middleware to update the updatedAt field before updating
lessonSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;
