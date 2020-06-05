const validator = require('express-validator');
const querystring = require('querystring');

const dateHelper = require('../helpers/date');
const DeliverySchedulesService = require('../services/DeliverySchedulesService');
const mapFieldErrors = require('../helpers/fieldErrors');

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
            var extractedErrors = mapFieldErrors(errors);

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
                 * capacity: string - Capacity (number of records to include in this delivery)
                 * confirmed: boolean - False to get the records only for viewing
                 */
                await DeliverySchedulesService.fetchDeliveryScheduleData({limit: limit})
                .then(result => {
                    data = result.data;

                    data.forEach(item => {
                        const formattedDeliveryDate = dateHelper.convertDate(item.DeliveryDate);
                        item.deliveryDate = formattedDeliveryDate.concatenated;
                    });

                    return res.render('delivery-schedule-list.njk', {deliveryData: data});
                })                

            } catch (err) {
                const error = new Error(err);

                return next(error);
            }
        }
    },

    delivery_schedule_confirmed_post: async (req, res, next) => {
        res.locals.query = req.body;

        const limit = req.body.delivery_limit;

        try {
            let data = [];

            /**
                 * capacity: string - Capacity (number of records to include in this delivery)
                 * confirmed: boolean - True to generate the CSV file and get the file URL
                 */
            await DeliverySchedulesService.confirmDeliverySchedule({limit: limit})
            .then(result => {
                data = result.data;

                return res.render('delivery-schedule-confirmed.njk', {deliveryData: data});
            })                

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    }
}