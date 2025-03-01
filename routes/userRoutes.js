const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { sendEmail } = require('../controllers/notificationController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authourizationMiddleware');

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user and returns a JWT token if successful.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Brandon
 *                 description: The user's name.
 *               email:
 *                 type: string
 *                 example: brandon@example.com
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 example: your_password
 *                 description: The user's password.
 *               passwordConfirm:
 *                 type: string
 *                 example: your_password
 *                 description: Confirmation of the user's password.
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Bad request, validation failed
 *       500:
 *         description: Server error
 */
router.post('/register', userController.register);


/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user and return a JWT token.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: brandon@example.com
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 example: your_password
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Bad request, missing email or password
 *       401:
 *         description: Unauthorized, invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users
 *     description: Fetch a list of all users in the system. Only accessible by admins.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []  # Requires JWT authentication
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User does not have permission
 *       500:
 *         description: Server error
 */
router.get('/users', authenticateUser, authorizeRoles('admin'), userController.getAllUsers);

	

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update a user
 *     description: Update user profile fields like name, profile picture, and bio.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []  # Requires JWT authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user profile
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a user
 *     description: Permanently delete a user by their ID.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []  # Requires JWT authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch('/users/:id', authenticateUser, authorizeRoles('admin', 'staff'), userController.updateUser);
router.delete('/users/:id', authenticateUser, authorizeRoles('admin'), userController.deleteUser);

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Send a notification email
 *     description: Sends a notification email to a specified user.
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: tenkphantasma@protonmail.com
 *                 description: Recipient's email address.
 *               subject:
 *                 type: string
 *                 example: Notification Alert
 *                 description: Email subject.
 *               message:
 *                 type: string
 *                 example: You have a new notification!
 *                 description: Quantum was here.
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification sent successfully
 *       400:
 *         description: Bad request, validation failed
 *       500:
 *         description: Server error
 */
router.post('/notifications', authenticateUser, sendEmail);

module.exports = router;
