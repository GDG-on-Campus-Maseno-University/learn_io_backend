const Course = require('../models/courseModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllCourses = catchAsync(async(req, res) => {
    const courses = await Course.find({ isActive: true })
        .populate('instructor', 'name email')
        .populate('prerequisites', 'title');

    res.status(200).json({
        status: 'success',
        results: courses.length,
        data: { courses }
    });
});

exports.getCourse = catchAsync(async(req, res, next) => {
    const course = await Course.findById(req.params.id)
        .populate('instructor', 'name email')
        .populate('prerequisites', 'title')
        .populate('enrolledStudents', 'name email');

    if (!course) {
        return next(new AppError('No course found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { course }
    });
});

exports.createCourse = catchAsync(async(req, res) => {
    // Only instructors/admins can create courses
    req.body.instructor = req.user.id; // Set instructor to current user

    const newCourse = await Course.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { course: newCourse }
    });
});

exports.updateCourse = catchAsync(async(req, res, next) => {
    // Only instructor who created the course or admin can update
    const course = await Course.findOneAndUpdate({ _id: req.params.id, instructor: req.user.id },
        req.body, { new: true, runValidators: true }
    );

    if (!course) {
        return next(new AppError('No course found or you are not authorized', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { course }
    });
});

exports.deleteCourse = catchAsync(async(req, res, next) => {
    const course = await Course.findByIdAndUpdate(
        req.params.id, { isActive: false }, { new: true }
    );

    if (!course) {
        return next(new AppError('No course found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.enrollInCourse = catchAsync(async(req, res, next) => {
    const course = await Course.findByIdAndUpdate(
        req.params.id, { $addToSet: { enrolledStudents: req.user.id } }, { new: true }
    );

    if (!course) {
        return next(new AppError('No course found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { course }
    });
});