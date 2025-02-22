const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define the lesson schema
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

// Middleware to update the `updatedAt` field before saving
lessonSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Middleware to update the `updatedAt` field before updating
lessonSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// Create the Lesson model
const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;