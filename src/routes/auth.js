const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { slowEndpoint, fastEndpoint } = require('../controllers/demoController');

router.post('/register', register);
router.post('/login', login);

// Profiling demo routes
router.get('/demo/slow', slowEndpoint);
router.get('/demo/fast', fastEndpoint);

module.exports = router;
