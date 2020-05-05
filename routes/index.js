const express = require('express');
const router = express.Router();

const authCheck = require('../helpers/auth');

// GET request
router.get('/', authCheck, function(req, res) {
    res.locals.query = req.query;
    res.locals.addresses_api_url = process.env.ADDRESSES_API_URL;
    res.locals.addresses_api_key = process.env.ADDRESSES_API_KEY;
    res.render("index.njk")
});

module.exports = router;