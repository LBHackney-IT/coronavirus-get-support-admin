const validator = require('express-validator');
const querystring = require('querystring');


const DeliverySchedulesService = require('../services/delivery_schedules.service');
const mapFieldErrors = require('../helpers/fieldErrors');

module.exports = {

    /**
     * @description Check if a delivery schedule report has already generated for the next day
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    delivery_schedule_get: async (req, res, next) => {
        res.locals.query = req.query;

        try {
            let data = [];

            await DeliverySchedulesService.checkDeliverySchedule()
            .then(result => {
                data = result;
                
                if(data && data.ReportFileId) {
                    return res.render('delivery-schedule-confirmed.njk', {deliveryData: data, removeOption: true});
                } else {
                    return res.render('delivery-schedule.njk');
                }                
            })                

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    },

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
                 * limit: string - Number of records to include in this delivery
                 */
                await DeliverySchedulesService.getDeliveryScheduleData({limit: limit})
                .then(result => {
                    data = result;

                    return res.render('delivery-schedule-list.njk', {deliveryData: data});
                })                

            } catch (err) {
                const error = new Error(err);

                return next(error);
            }
        }
    },

    /**
     * @description Confirm the delivery schedule and expect a link to the generated CSV file
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    delivery_schedule_confirmed_post: async (req, res, next) => {
        res.locals.query = req.body;

        const limit = req.body.delivery_limit;

        try {
            let data = [];

            /**
             * @param limit: string - Number of records to include in this delivery
             */
            await DeliverySchedulesService.confirmDeliverySchedule({limit: limit})
            .then(result => {
                data = result;

                return res.render('delivery-schedule-confirmed.njk', {deliveryData: data});
            })                

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    },


    /**
     * @description Delete the current delivery schedule
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    delivery_schedule_delete: async (req, res, next) => {

        try {
            let data = [];

            await DeliverySchedulesService.deleteDeliverySchedule()
            .then(result => {
                data = result;

                if(data.ReportFileId) {
                    return res.render('delivery-schedule-confirmed.njk', {deliveryData: data, removeOption: true});
                } else {
                    return res.render('delivery-schedule.njk');
                }                
            })                

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    }
}