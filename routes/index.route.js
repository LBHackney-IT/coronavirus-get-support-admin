const express = require('express');
const router = express.Router();

const indexController = require('../controllers/index.controller');
const {isAuthorised} = require('../middleware/auth');

// GET request to display index page
router.get('/', isAuthorised, indexController.index_get);

module.exports = router;