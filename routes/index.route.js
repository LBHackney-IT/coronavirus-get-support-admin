const express = require('express');
const router = express.Router();

const config = require('../config');
const indexController = require('../controllers/index.controller');
const {isAuthorised} = require('../middleware/auth');

// GET request to display index page
router.get('/', isAuthorised, function(req, res, next) {
    res.locals.query = req.query;
    res.locals.isAdmin = req.auth.isAdmin;

    res.locals.canManage = {
        helpRequests: config.help_requests_enabled === 'true' ? true : false,
        foodRequests: config.food_requests_enabled === 'true' ? true : false
    };
    
    indexController.index_get(req, res, next);
});

module.exports = router;