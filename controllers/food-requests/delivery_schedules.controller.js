"use strict";

const validator = require('express-validator');
const querystring = require('querystring');


const DeliverySchedulesService = require('../../services/food-requests/delivery_schedules.service');
const { mapFieldErrors } = require('../../helpers/fieldErrors');

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
        res.locals.isAdmin = req.auth.isAdmin;

        try {

            await DeliverySchedulesService.checkDeliverySchedule()
            .then(result => {
                let data = result;

                if(data.isError) {
                    return res.render('error.njk', {error: data} );
                };

                if(data && data.ReportFileId) {
                    return res.render('food-requests/delivery-schedule-confirmed.njk', {deliveryData: data, removeOption: true});
                } else {
                    return res.render('food-requests/delivery-schedule.njk');
                }
            });

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
              "/food-requests/delivery-schedules?" +
                querystring.stringify(extractedErrors) +
                "&" +
                querystring.stringify(req.body)
            );
        } else {

            try {
                /**
                 * limit: string - Number of records to include in this delivery
                 */
                await DeliverySchedulesService.getDeliveryScheduleData({limit: limit})
                .then(result => {
                    let data = result;

                    if(data.isError) {
                        return res.render('error.njk', {error: data} );
                    };

                    return res.render('food-requests/delivery-schedule-list.njk', {deliveryData: data});
                });

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
            
            /**
             * @param limit: string - Number of records to include in this delivery
             */
            await DeliverySchedulesService.confirmDeliverySchedule({limit: limit})
            .then(result => {
                let data = result;

                if(data.isError) {
                    return res.render('error.njk', {error: data} );
                };

                return res.render('food-requests/delivery-schedule-confirmed.njk', {deliveryData: data});
            });

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
            await DeliverySchedulesService.deleteDeliverySchedule(req.params.id)
            .then(result => {

                let data = result;

                if(data.isError) {
                    return res.render('error.njk', {error: data} );
                } else {
                    data = result.data;
                }

                return res.redirect('/food-requests/delivery-schedules');
            });           

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    }
}