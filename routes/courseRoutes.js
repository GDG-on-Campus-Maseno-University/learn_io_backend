const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authController = require('../controllers/authController');
const { restrictTo } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - instructor
 *         - department
 *         - credits
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID
 *         title:
 *           type: string
 *           description: Course title
 *         description:
 *           type: string
 *           description: Course description
 *         instructor:
 *           type: string
 *           description: ID of the instructor
 *         department:
 *           type: string
 *           enum: [computer_science, mathematics, physics, biology, chemistry, engineering]
 *         credits:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         difficulty:
 *           type: string
 *           enum: [introductory, intermediate, advanced]
 *         schedule:
 *           type: object
 *           properties:
 *             days:
 *               type: array
 *               items:
 *                 type: string
 *                 enum: [monday, tuesday, wednesday, thursday, friday]
 *             time:
 *               type: string
 *             classroom:
 *               type: string
 *         prerequisites:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of prerequisite course IDs
 *         capacity:
 *           type: number
 *           description: Maximum enrollment capacity
 *         isActive:
 *           type: boolean
 *           description: Whether the course is active
 *         enrolledStudents:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of enrolled student IDs
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Academic course management API
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve all active courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: A list of active courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
 */
router.get('/', courseController.getAllCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     course:
 *                       $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
router.get('/:id', courseController.getCourse);

// Protected routes
router.use(authController.protect);

/**
 * @swagger
 * /courses/{id}/enroll:
 *   post:
 *     summary: Enroll in a course (Student only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Successfully enrolled in course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     course:
 *                       $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized (not a student)
 *       404:
 *         description: Course not found
 */
router.post('/:id/enroll', restrictTo('student'), courseController.enrollInCourse);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course (Instructor/Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     course:
 *                       $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input data
 */
router.post('/', courseController.createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   patch:
 *     summary: Update a course (Instructor/Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     course:
 *                       $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found or not authorized
 *       400:
 *         description: Invalid input data
 */
router.patch('/:id', courseController.updateCourse);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete (deactivate) a course (Instructor/Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     responses:
 *       204:
 *         description: Course deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
router.delete('/:id', courseController.deleteCourse);

module.exports = router;