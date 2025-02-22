const express = require('express');
const userRoutes = require('./userRoutes');

const router = express.Router();

// Use specific routes with their respective paths
router.use('/api', userRoutes);

module.exports = router;