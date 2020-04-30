const express = require('express');
const router = express.Router();

// GET request
router.get('/', function(req, res) {
    res.locals.query = req.query;
    res.locals.addresses_api_url = process.env.ADDRESSES_API_URL;
    res.locals.addresses_api_key = process.env.ADDRESSES_API_KEY;
    res.render("index.njk")
});

module.exports = router;