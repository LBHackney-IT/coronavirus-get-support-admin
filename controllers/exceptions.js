const validator = require('express-validator');
const querystring = require('querystring');

const dateHelper = require('../helpers/date');
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
    all_exceptions_get: async (req, res, next) => {

        try {
            let data = [];

            await helpRequestService.fetchAllExceptions()
            .then(result => {
                data = result.data;

                data.forEach(item => {
                    const formattedCreationDate = dateHelper.convertDate(item.DateTimeRecorded);

                    item.creation_date = formattedCreationDate.concatenated;
                });

                return res.render('exceptions-list.njk', {exceptionsData: data});
            })                

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    },


    /**
     * @description Display a list of help requests matching the UPRN.
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    all_help_requests_get: async (req, res, next) => {

        try {
            let data = [];

            await helpRequestService.fetchAllHelpRequests({uprn: req.params.uprn, master: false})
            .then(result => {
                data = result.data;

                if (data.length) {
                    data.forEach(item => {
                        item["RecordStatus_" + item.Id] = item.RecordStatus;
                        item["IsDuplicate_" + item.Id] = item.IsDuplicate;
                        item["OngoingFoodNeed_" + item.Id] = item.OngoingFoodNeed;
                        item["ContactTelephoneNumber_" + item.Id] = item.ContactTelephoneNumber;
                        item["ContactMobileNumber_" + item.Id] = item.ContactMobileNumber;
                        item["EmailAddress_" + item.Id] = item.EmailAddress;
                        item["NumberOfPeopleInHouse_" + item.Id] = item.NumberOfPeopleInHouse;

                        item["DobDay_" + item.Id] = item.DobDay;
                        item["DobMonth_" + item.Id] = item.DobMonth;
                        item["DobYear_" + item.Id] = item.DobYear;

                        const formattedCreationDate = dateHelper.convertDate(item.DateTimeRecorded);

                        item.creation_date = formattedCreationDate.concatenated;

                        if (item.LastConfirmedFoodDelivery) {
                            const formattedDeliveryDate = dateHelper.convertDate(item.LastConfirmedFoodDelivery);

                            item["last_confirmed_food_delivery_day_" + item.Id] = formattedDeliveryDate.day;
                            item["last_confirmed_food_delivery_month_" + item.Id] = formattedDeliveryDate.month;
                            item["last_confirmed_food_delivery_year_" + item.Id] = formattedDeliveryDate.year;
                            item["last_confirmed_food_delivery_date_" + item.Id] = formattedDeliveryDate.concatenated;
                        }
                    });

                    data.AddressFirstLine = data[0].AddressFirstLine;
                    data.AddressSecondLine = data[0].AddressSecondLine;
                    data.Postcode = data[0].Postcode;

                    res.locals.query = data;
                };

                return res.render('exceptions-edit.njk', {helpRequestData: data, uprn:  req.params.uprn});
            })                

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    }
};