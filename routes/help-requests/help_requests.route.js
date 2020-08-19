const express = require('express');
const router = express.Router();

const { helpRequestCreateValidation, helpRequestEditValidation, addressValidation, helpRequestCompleteValidation } = require('../../middleware/validation');
const helpRequestsController = require('../../controllers/help-requests/help_requests.controller');
const {isAuthorised}= require('../../middleware/auth');

// GET request for Help Request homepage
router.get('/', isAuthorised, function(req, res, next) {
    res.locals.query = req.query;
    res.locals.isAdmin = req.auth.isAdmin;

    helpRequestsController.index_get(req, res, next);
});

// GET request for the callback page
router.get('/callbacks', isAuthorised, function(req, res, next) {
    res.locals.query = req.query;
    res.locals.isAdmin = req.auth.isAdmin;

    helpRequestsController.all_callbacks_get(req, res, next);

});

// GET request for the help request search page
router.get('/search', isAuthorised, function(req, res) {
    res.locals.query = req.query;
    res.locals.isAdmin = req.auth.isAdmin;

    res.render("help-requests/help-requests-search.njk");
});

// GET request to display 1 help request
router.get('/edit/:id', isAuthorised, helpRequestsController.help_request_get);

// GET request to display the help request complete page
router.get('/complete/:id', isAuthorised, helpRequestsController.help_request_complete_get);

// GET request to create a new help request
router.get('/create', isAuthorised, helpRequestsController.help_request_create_get);


// POST request to get all help requests by postcode
router.post('/search', [isAuthorised, addressValidation], (req, res, next) => {
    helpRequestsController.search_help_requests_post(req, res, next)
});

// POST request to update 1 help request
router.post('/edit/:id', [isAuthorised, helpRequestEditValidation], (req, res, next) => {
    helpRequestsController.help_request_update_post(req, res, next)
});

// POST request to complete
router.post('/complete/:id', [isAuthorised, helpRequestCompleteValidation], (req, res, next) => {
    helpRequestsController.help_request_complete_post(req, res, next)
});


// POST request to create a new help request
router.post('/create', [isAuthorised, helpRequestCreateValidation], (req, res, next) => {
    helpRequestsController.help_request_create_post(req, res, next)
});

// post request to edit a snapshot for the resident
router.post('/snapshot/:id', [isAuthorised], (req, res, next) => {
    helpRequestsController.help_request_edit_snapshot(req, res, next)
});

module.exports = router;