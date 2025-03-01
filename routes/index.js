const express = require('express');
const userRoutes = require('./userRoutes');
const lessonRoutes = require('./lessonRoutes');
const router = express.Router();

// Use specific routes with their respective paths
router.use('/api', userRoutes);
router.use('/api', lessonRoutes);

module.exports = router;