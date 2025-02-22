const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/lessonsController');

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: API for managing lessons
 */

/**
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: Retrieve all lessons
 *     description: Fetch a list of all lessons that are not deleted.
 *     tags: [Lessons]
 *     responses:
 *       200:
 *         description: A list of lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: number
 *                   example: 2
 *                 data:
 *                   type: object
 *                   properties:
 *                     lessons:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Lesson'
 *       500:
 *         description: Server error
 */
router.get('/', lessonsController.getAllLessons);

/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     summary: Retrieve a single lesson by ID
 *     description: Fetch a lesson by its unique ID.
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lesson to retrieve
 *     responses:
 *       200:
 *         description: A single lesson
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     lesson:
 *                       $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server error
 */
router.get('/:id', lessonsController.getLessonById);

/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: Create a new lesson
 *     description: Creates a new lesson and returns the created lesson object.
 *     tags:
 *       - Lessons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to Programming
 *                 description: The title of the lesson.
 *               description:
 *                 type: string
 *                 example: This lesson covers the basics of programming.
 *                 description: The description of the lesson.
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lesson created successfully
 *                 lesson:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier for the lesson.
 *                     title:
 *                       type: string
 *                       description: The title of the lesson.
 *                     description:
 *                       type: string
 *                       description: The description of the lesson.
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the lesson was created.
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the lesson was last updated.
 *                     is_deleted:
 *                       type: boolean
 *                       description: Indicates if the lesson is marked as deleted.
 *       400:
 *         description: Bad request, validation failed
 *       500:
 *         description: Server error
 */
router.post('/', lessonsController.createLesson);

/**
 * @swagger
 * /api/lessons/{id}:
 *   put:
 *     summary: Update an existing lesson
 *     description: Update a lesson by its unique ID.
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lesson to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Node.js Mastery
 *                 description: The updated title of the lesson
 *               description:
 *                 type: string
 *                 example: Master advanced concepts in Node.js
 *                 description: The updated description of the lesson
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     lesson:
 *                       $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lesson not found
 *       400:
 *         description: Bad request, validation failed
 *       500:
 *         description: Server error
 */
router.put('/:id', lessonsController.updateLesson);

/**
 * @swagger
 * /api/lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     description: Soft-delete a lesson by setting `is_deleted` to `true`.
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lesson to delete
 *     responses:
 *       204:
 *         description: Lesson deleted successfully
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', lessonsController.deleteLesson);

module.exports = router;