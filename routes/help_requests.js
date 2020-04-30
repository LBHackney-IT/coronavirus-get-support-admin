const express = require('express');
const router = express.Router();

const { addressValidation, helpRequestValidation } = require('../middleware/validation');
const helpRequestsController = require('../controllers/help_requests');

// GET request to display 1 help request
router.get('/edit/:id', helpRequestsController.help_request_get);

// POST request to update 1 help request
router.post('/edit/:id', helpRequestValidation, (req, res, next) => {
    console.log("ROUTE /update");

    helpRequestsController.help_request_update_post(req, res, next)
});

// POST request to get all help requests
router.post('/', addressValidation, (req, res, next) => {
    helpRequestsController.all_help_requests_post(req, res, next)
});

module.exports = router;