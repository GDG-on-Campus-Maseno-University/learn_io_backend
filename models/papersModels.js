const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const paperSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title for the paper']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for the paper']
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
paperSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Middleware to update the updatedAt field before updating
paperSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Paper = mongoose.model('paper', paperSchema);
module.exports = Paper;