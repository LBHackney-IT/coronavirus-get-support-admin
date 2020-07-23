const express = require('express');
const router = express.Router();

const { deliveryLimitValidation } = require('../../middleware/validation');
const deliverySchedulesController = require('../../controllers/food-requests/delivery_schedules.controller');
const {isAuthorised, isAdmin} = require('../../middleware/auth');

// GET request to search delivey schedule
router.get('/', [isAuthorised], (req, res, next) => {
   deliverySchedulesController.delivery_schedule_get(req, res, next)
});

// POST request to retrieve the list of records for the next delivery schedule report
router.post('/list', [isAuthorised, deliveryLimitValidation], (req, res, next) => {
    deliverySchedulesController.delivery_schedule_list_post(req, res, next)
});

// POST request to confirm the next delivery schedule report
router.post('/confirmed', [isAuthorised, deliveryLimitValidation], (req, res, next) => {
    deliverySchedulesController.delivery_schedule_confirmed_post(req, res, next)
});

// DELETE request to remove the current delivery schedule report
router.get('/delete/:id', [isAuthorised, isAdmin], (req, res, next) => {
    deliverySchedulesController.delivery_schedule_delete(req, res, next)
});

module.exports = router;