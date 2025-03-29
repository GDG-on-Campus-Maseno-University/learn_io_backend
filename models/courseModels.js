const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A course must have a title'],
        trim: true,
        unique: true
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'A course must have a description']
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A course must have an instructor']
    },
    department: {
        type: String,
        required: [true, 'A course must belong to a department'],
        enum: ['computer_science', 'mathematics', 'physics', 'biology', 'chemistry', 'engineering']
    },
    credits: {
        type: Number,
        required: [true, 'A course must have credit hours'],
        min: 1,
        max: 5
    },
    difficulty: {
        type: String,
        enum: ['introductory', 'intermediate', 'advanced'],
        default: 'intermediate'
    },
    schedule: {
        days: [{
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }],
        time: String,
        classroom: String
    },
    prerequisites: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Course'
    }],
    capacity: {
        type: Number,
        default: 30
    },
    enrolledStudents: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create slug from title
courseSchema.pre('save', function(next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;