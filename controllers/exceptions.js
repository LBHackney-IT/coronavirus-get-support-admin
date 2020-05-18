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
                let recordIDs = [];

                data = result.data;

                if (data.length) {
                    const dynamicFields = [
                        "RecordStatus",
                        "IsDuplicate",
                        "OngoingFoodNeed",
                        "ContactTelephoneNumber",
                        "ContactMobileNumber",
                        "EmailAddress",
                        "NumberOfPeopleInHouse",
                        "DobDay",
                        "DobMonth",
                        "DobYear",
                        "DeliveryNotes",
                        "CaseNotes"
                    ];

                    let formattedCreationDate = {};

                    data.forEach(item => {
                        recordIDs.push(item.Id);

                        dynamicFields.forEach((fieldName) => {
                            item[fieldName + "_" + item.Id] = item[fieldName];
                        });

                        formattedCreationDate = dateHelper.convertDate(item.DateTimeRecorded);

                        item.creation_date = formattedCreationDate.concatenated;

                        if (item.LastConfirmedFoodDelivery) {
                            const formattedDeliveryDate = dateHelper.convertDate(item.LastConfirmedFoodDelivery);

                            item["last_confirmed_food_delivery_day_" + item.Id] = formattedDeliveryDate.day;
                            item["last_confirmed_food_delivery_month_" + item.Id] = formattedDeliveryDate.month;
                            item["last_confirmed_food_delivery_year_" + item.Id] = formattedDeliveryDate.year;
                            item["last_confirmed_food_delivery_date_" + item.Id] = formattedDeliveryDate.concatenated;
                        }

                        data.AddressFirstLine = data[0].AddressFirstLine;
                        data.AddressSecondLine = data[0].AddressSecondLine;
                        data.Postcode = data[0].Postcode;
                    });

                    data.recordIDs = recordIDs.join(',');

                    res.locals.query = data;
                };

                return res.render('exceptions-edit.njk', {helpRequestData: data, uprn:  req.params.uprn});
            })                

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    },


    /**
     * @description Update a list of help requests
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    all_help_requests_post: async (req, res, next) => {
        res.locals.query = req.body;

        let recIds = req.body.record_ids.split(',');

        const dynamicFields = [
            "RecordStatus",
            "ContactTelephoneNumber",
            "ContactMobileNumber",
            "EmailAddress",
            "NumberOfPeopleInHouse",
            "DobDay",
            "DobMonth",
            "DobYear",
            "IsDuplicate",
            "DeliveryNotes",
            "CaseNotes"
        ];

        // const errors = validator.validationResult(req);
        const errors = {}

        //!errors.isEmpty()
        if (1===2 ) {
            var extractedErrors = {};
            errors
                .array()
                .map(err => (extractedErrors["error_" + err.param] = err.msg));
           
            return res.redirect(
                "exceptions/" + req.body.uprn + "?" +
                querystring.stringify(extractedErrors) +
                "&" +
                querystring.stringify(req.body)
            );
        } else {
            var query = req.body;

            try {
                let recordsData = [];

                recIds.forEach( id => {
                    let recFields = {};

                    recFields.id = id;

                    dynamicFields.forEach(field => {
                        recFields[field] = req.body[field + "_" + id];
                    });

                    recFields.OngoingFoodNeed = req.body["OngoingFoodNeed_" + id] === 'yes' ? true : false;

                    const lcfdDay = req.body["last_confirmed_delivery_day_" + id];
                    const lcfdMonth = req.body["last_confirmed_delivery_month_" + id];
                    const lcfdYear = req.body["last_confirmed_delivery_year_" + id];

                    const lastConfirmedFoodDelivery = new Date(Date.UTC(lcfdYear, lcfdMonth - 1, lcfdDay));

                    recFields.LastConfirmedFoodDelivery = lastConfirmedFoodDelivery.toISOString();

                    recordsData.push(recFields);
                });

                // Update all the Help Request records
                await helpRequestService.updateAllHelpRequests(recordsData)
                .then(result => {
                    return res.redirect("/exceptions");
                })  

            } catch (err) {
                const error = new Error(err);
    
                return next(error);
            }

        
        
        }

    }
};