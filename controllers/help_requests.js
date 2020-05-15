const validator = require('express-validator');
const querystring = require('querystring');

const helpRequestService = require('../services/HelpRequestsService');

// Show index page.
module.exports = {

    /**
     * @description Display a list of help requests matching the UPRN.
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    all_help_requests_post: async (req, res, next) => {
        res.locals.query = req.body;
        const uprn = req.body.uprn;

        const errors = validator.validationResult(req);

        if (!errors.isEmpty()) {
            var extractedErrors = {};

            errors
              .array()
              .map(err => (extractedErrors["error_" + err.param] = err.msg));

            return res.redirect(
              "/?" +
                querystring.stringify(extractedErrors) +
                "&" +
                querystring.stringify(req.body)
            );
          } else {

            try {
                let data = [];

                /**
                 * uprn: string - UPRN number
                 * master: boolean - specify whether to return only master records or all
                 */
                await helpRequestService.fetchAllHelpRequests({uprn: uprn, master: true})
                .then(result => {
                    data = result.data;

                    data.forEach(item => {
                        const recDate = new Date(item.DateTimeRecorded);
                        item.DateTimeRecorded = recDate.toLocaleDateString();
                    });

                    return res.render('help-requests.njk', {title: 'Home', uprn: uprn, helpRequests: data});
                })                

            } catch (err) {
                const error = new Error(err);

                return next(error);
            }
        }

    },    


    /**
     * @description Render a specific help request
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    help_request_get: async (req, res, next) => {
        try {

            if(req.query.Id) {
                res.locals.query = req.query;

                return res.render('help-request.njk');

            } else {
                await helpRequestService.fetchHelpRequest(req.params.id)
                .then(result => {
                    let data = result.data;

                    if (data.LastConfirmedFoodDelivery) {
                        const lastConfirmedFoodDelivery = new Date(data.LastConfirmedFoodDelivery);

                        data.OngoingFoodNeed = data.OngoingFoodNeed === true ? "yes" : "no";
                        data.last_confirmed_food_delivery_day = lastConfirmedFoodDelivery.getDate();
                        data.last_confirmed_food_delivery_month = lastConfirmedFoodDelivery.getMonth() + 1;
                        data.last_confirmed_food_delivery_year = lastConfirmedFoodDelivery.getFullYear();
                    }

                    res.render('help-request.njk', {query: data});
                })
            }

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }

    }, 


    /**
     * @description Update a specific help request
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    help_request_update_post: async (req, res, next) => {
        res.locals.query = req.body;
        const errors = validator.validationResult(req);

        if (!errors.isEmpty()) {
            var extractedErrors = {};

            errors
              .array()
              .map(err => (extractedErrors["error_" + err.param] = err.msg));

            return res.redirect(
              "/help-requests/edit/" + req.body.Id + "?" +
                querystring.stringify(extractedErrors) +
                "&" +
                querystring.stringify(req.body)
            );
          } else {

            try {
                const query = req.body;

                const Uprn = query.Uprn;
                const Id = query.Id;
                const day = query.last_confirmed_food_delivery_day;
                const month = query.last_confirmed_food_delivery_month;
                const year = query.last_confirmed_food_delivery_year;
                const lastConfirmedDeliveryDate = new Date(Date.UTC(year, month - 1, day));

                const updatedData = JSON.stringify({
                    OngoingFoodNeed: query.OngoingFoodNeed == "yes" && true || false,
                    NumberOfPeopleInHouse: query.NumberOfPeopleInHouse || 0,
                    LastConfirmedFoodDelivery: lastConfirmedDeliveryDate.toISOString()
                });

                await helpRequestService.updateHelpRequest(Id, updatedData)
                .then(result => {
                    return res.render('help-requests-update.njk', {updatedData: updatedData, Uprn: Uprn, Id: Id});
                })                

            } catch (err) {
                const error = new Error(err);

                return next(error);
            }
        }
    }       
};