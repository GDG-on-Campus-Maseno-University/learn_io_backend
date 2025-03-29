const express = require('express');
const router = express.Router();
const papersController = require('../controllers/papersController');
const upload = require('../middlewares/uploadMiddleware');
const { authenticateUser, authorizeRoles } = require('../middlewares/authourizationMiddleware');


/**
 * @swagger
 * components:
 *   schemas:
 *     Paper:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the Paper
 *         title:
 *           type: string
 *           description: The Paper title
 *         description:
 *           type: string
 *           description: A brief description of the Paper
 *         file:
 *           type: string
 *           format: binary
 *           description: The uploaded Paper file (PDF or DOC)
 */

/**
 * @swagger
 * tags:
 *   name: papers
 *   description: Paper management API
 */

/**
 * @swagger
 * /api/papers:
 *   get:
 *     summary: Retrieve all papers
 *     tags: [papers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of papers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Paper'
 */

router.get('/papers/', papersController.getAllPapers);


/**
 * @swagger
 * /api/papers/{id}:
 *   get:
 *     summary: Get a Paper by ID
 *     tags: [papers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Paper ID
 *     responses:
 *       200:
 *         description: Paper data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paper'
 *       404:
 *         description: Paper not found
 */

router.get('/papers/:id', authenticateUser, papersController.getPapersById);


/**
 * @swagger
 * /api/papers:
 *   post:
 *     summary: Create a new Paper
 *     tags: [papers]
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
 *                 description: Paper title
 *               description:
 *                 type: string
 *                 description: Paper description
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File upload (PDF/DOC)
 *     responses:
 *       201:
 *         description: Paper created successfully
 *       400:
 *         description: Bad request
 */

router.post('/papers', authenticateUser, authorizeRoles('admin', 'staff'), upload.single('file'), papersController.createPapers);


/**
 * @swagger
 * /api/papers:
 *   put:
 *     summary: Update an existing Paper
 *     tags: [papers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Paper ID
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
 *         description: Paper updated successfully
 *       404:
 *         description: Paper not found
 */

router.put('/papers/:id', authenticateUser, authorizeRoles('admin', 'staff'), upload.single('file'), papersController.updatePapers);


/**
 * @swagger
 * /papers/{id}:
 *   delete:
 *     summary: Soft delete a Paper
 *     tags: [papers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Paper ID
 *     responses:
 *       204:
 *         description: Paper deleted successfully
 *       404:
 *         description: Paper not found
 */

router.delete('/papers/:id', authenticateUser, authorizeRoles('admin', 'staff'), papersController.deletePapers);


module.exports = router;