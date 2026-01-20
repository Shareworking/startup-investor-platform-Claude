const express = require('express');
const router = express.Router();
const startupController = require('../controllers/startupController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', startupController.getAllStartups);
router.get('/:id', startupController.getStartupById);

// Protected routes
router.post('/', authMiddleware, startupController.createStartup);
router.get('/my/startups', authMiddleware, startupController.getMyStartups);
router.put('/:id', authMiddleware, startupController.updateStartup);
router.delete('/:id', authMiddleware, startupController.deleteStartup);
router.post('/:id/cofounders', authMiddleware, startupController.addCoFounder);
router.delete('/:id/cofounders/:userId', authMiddleware, startupController.removeCoFounder);

module.exports = router;
