const express = require('express');
const router = express.Router();

const exceptionsController = require('../../controllers/food-requests/exceptions.controller');
const {isAuthorised, isAdmin} = require('../../middleware/auth');

// GET request to get all exceptions
router.get('/', [isAuthorised, isAdmin], exceptionsController.all_exceptions_list);

// GET request to display all help requests by UPRN
router.get('/:uprn', [isAuthorised, isAdmin], exceptionsController.all_food_requests_get);

// POST request to update help requests
router.post('/:uprn', [isAuthorised, isAdmin], exceptionsController.all_food_requests_post);

module.exports = router;