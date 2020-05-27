const express = require('express');
const router = express.Router();

const { addressValidation, helpRequestValidation } = require('../middleware/validation');
const helpRequestsController = require('../controllers/help_requests');
const {isAuthorised}= require('../middleware/auth');

router.get('/', isAuthorised, function(req, res) {
    res.locals.query = req.query;

    res.render("help-requests-search.njk");
});

// POST request to get all help requests
router.post('/', [isAuthorised, addressValidation], (req, res, next) => {
    helpRequestsController.all_help_requests_post(req, res, next)
});

// GET request to display 1 help request
router.get('/edit/:id', isAuthorised, helpRequestsController.help_request_get);

// POST request to update 1 help request
router.post('/edit/:id', isAuthorised, helpRequestValidation, (req, res, next) => {
    helpRequestsController.help_request_update_post(req, res, next)
});



module.exports = router;