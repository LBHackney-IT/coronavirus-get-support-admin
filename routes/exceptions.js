const express = require('express');
const router = express.Router();

const exceptionsController = require('../controllers/exceptions');
const authCheck = require('../helpers/auth');

// GET request to get all exceptions
router.get('/', exceptionsController.all_exceptions_get);

// GET request to display all help requests by UPRN
router.get('/:uprn', authCheck, exceptionsController.all_help_requests_get);

module.exports = router;