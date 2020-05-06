const express = require('express');
const router = express.Router();

const exceptionsController = require('../controllers/exceptions');

// POST request to get all help requests
router.get('/', exceptionsController.all_exceptions_get);

module.exports = router;