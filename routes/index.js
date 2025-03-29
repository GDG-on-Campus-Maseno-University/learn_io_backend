const express = require('express');
const userRoutes = require('./userRoutes');
const paperRoutes = require('./paperRoutes');

const articlesRoutes = require('./articlesRoutes');
const paperRouter = require("./paperRoutes");

const router = express.Router();

// Use specific routes with their respective paths
router.use('/api', userRoutes);
router.use('/api', paperRoutes);
router.use('/api', articlesRoutes);


module.exports = router;