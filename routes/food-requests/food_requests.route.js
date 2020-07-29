const express = require('express');
const router = express.Router();

const { foodRequestValidation, searchValidation } = require('../../middleware/validation');
const foodRequestsController = require('../../controllers/food-requests/food_requests.controller');
const {isAuthorised, isAdmin}= require('../../middleware/auth');

// GET request for Food Request homepage
router.get('/', [isAuthorised, isAdmin], function(req, res, next) {
    res.locals.query = req.query;
    res.locals.isAdmin = req.auth.isAdmin;

    foodRequestsController.index_get(req, res, next);
});

// GET request for the food request search page
router.get('/search', [isAuthorised, isAdmin], function(req, res) {
    res.locals.query = req.query;
    res.locals.isAdmin = req.auth.isAdmin;

    res.render("food-requests/food-requests-search.njk");
});

// POST request to get all food requests by postcode
router.post('/search', [isAuthorised, isAdmin, searchValidation], (req, res, next) => {
    foodRequestsController.all_food_requests_post(req, res, next)
});

// GET request to display 1 food request
router.get('/edit/:id', [isAuthorised, isAdmin], foodRequestsController.food_request_get);

// POST request to update 1 food request
router.post('/edit/:id', [isAuthorised, isAdmin, foodRequestValidation], (req, res, next) => {
    foodRequestsController.food_request_update_post(req, res, next)
});



module.exports = router;