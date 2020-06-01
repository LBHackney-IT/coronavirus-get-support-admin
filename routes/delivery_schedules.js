const express = require('express');
const router = express.Router();

const { deliveryLimitValidation } = require('../middleware/validation');
const deliverySchedulesController = require('../controllers/delivery_schedules');
const {isAuthorised, isAdmin} = require('../middleware/auth');

// GET request to search delivey schedule
router.get('/', [isAuthorised, isAdmin], function(req, res) {
    res.locals.query = req.query;
    res.render("delivery-schedules.njk");
});

router.post('/list', [isAuthorised, isAdmin, deliveryLimitValidation], deliverySchedulesController.delivery_schedule_list_post);

module.exports = router;