const express = require('express');
const router = express.Router();

const {isAuthorised} = require('../middleware/auth');

// GET request
router.get('/', isAuthorised, function(req, res) {
    res.locals.isAdmin = req.auth.isAdmin;
    res.render("index.njk");
});

module.exports = router;