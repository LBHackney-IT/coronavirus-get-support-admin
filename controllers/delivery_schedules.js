const validator = require('express-validator');
const querystring = require('querystring');

const dateHelper = require('../helpers/date');
const DeliverySchedulesService = require('../services/DeliverySchedulesService');

// Show index page.
module.exports = {

    /**
     * @description Display a list of records to include in the delivery schedule.
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    delivery_schedule_list_post: async (req, res, next) => {
        res.locals.query = req.body;

        const limit = req.body.delivery_limit;

        const errors = validator.validationResult(req);

        if (!errors.isEmpty()) {
            var extractedErrors = {};

            errors
              .array()
              .map(err => (extractedErrors["error_" + err.param] = err.msg));

            return res.redirect(
              "/delivery-schedules?" +
                querystring.stringify(extractedErrors) +
                "&" +
                querystring.stringify(req.body)
            );
        } else {

            try {
                let data = [];

                /**
                 * capacity: string - Capacity
                 * confirmed: boolean - specify whether to confirm the delivery or not
                 */
                await DeliverySchedulesService.fetchDeliveryScheduleRecords({limit: limit, confirmed: false})
                .then(result => {
                    data = result.data;

                    data.forEach(item => {
                        const formattedDeliveryDate = dateHelper.convertDate(item.DeliveryDate);
                        item.deliveryDate = formattedDeliveryDate.concatenated;
                    });

                    return res.render('delivery-schedule-list.njk', {deliveryRecords: data});
                })                

            } catch (err) {
                const error = new Error(err);

                return next(error);
            }
        }
    }
}