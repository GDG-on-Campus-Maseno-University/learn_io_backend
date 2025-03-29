const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/papersController');
const upload = require('../middlewares/uploadMiddleware');
const { authenticateUser, authorizeRoles } = require('../middlewares/authourizationMiddleware');


/**
 * @swagger
 * components:
 *   schemas:
 *     Lesson:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the lesson
 *         title:
 *           type: string
 *           description: The lesson title
 *         description:
 *           type: string
 *           description: A brief description of the lesson
 *         file:
 *           type: string
 *           format: binary
 *           description: The uploaded lesson file (PDF or DOC)
 */

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Lesson management API
 */

/**
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: Retrieve all lessons
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */

router.get('/lessons/', lessonsController.getAllLessons);


/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     summary: Get a lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The lesson ID
 *     responses:
 *       200:
 *         description: Lesson data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lesson not found
 */

router.get('/lessons/:id', authenticateUser, lessonsController.getLessonById);


/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Lesson title
 *               description:
 *                 type: string
 *                 description: Lesson description
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File upload (PDF/DOC)
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Bad request
 */

router.post('/lessons', authenticateUser, authorizeRoles('admin', 'staff'), upload.single('file'), lessonsController.createLesson);


/**
 * @swagger
 * /api/lessons:
 *   put:
 *     summary: Update an existing lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The lesson ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional file update
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       404:
 *         description: Lesson not found
 */

router.put('/lessons/:id', authenticateUser, authorizeRoles('admin', 'staff'), upload.single('file'), lessonsController.updateLesson);


/**
 * @swagger
 * /lessons/{id}:
 *   delete:
 *     summary: Soft delete a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The lesson ID
 *     responses:
 *       204:
 *         description: Lesson deleted successfully
 *       404:
 *         description: Lesson not found
 */

router.delete('/lessons/:id', authenticateUser, authorizeRoles('admin', 'staff'), lessonsController.deleteLesson);


module.exports = router;