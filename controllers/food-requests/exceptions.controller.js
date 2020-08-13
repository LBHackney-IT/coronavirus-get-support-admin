"use strict";

const querystring = require('querystring');

const notesHelper = require('../../helpers/notes');
const mapFieldErrors = require('../../helpers/fieldErrors');
const FoodRequestsService = require('../../services/food-requests/food_requests.service');
const ExceptionsService = require('../../services/food-requests/exceptions.service');

module.exports = {

    /**
     * @description Display a list of food requests matching the UPRN.
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    all_exceptions_list: async (req, res, next) => {
        try {
            let data = [];

            await ExceptionsService.getAllExceptions()
            .then(result => {
                data = result;

                return res.render('food-requests/exceptions-list.njk', {exceptionsData: data});
            })                

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    },


    /**
     * @description Display a list of food requests matching the UPRN.
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    all_food_requests_get: async (req, res, next) => {
        try {
            let data = [];

            await ExceptionsService.getAllMatchingFoodRequests({uprn: req.params.uprn, master: false})
            .then(result => {
                data = result;

                res.locals.query = data;

                return res.render('food-requests/exceptions-edit.njk', {foodRequestData: data, uprn:  req.params.uprn});
            })                

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    },


    /**
     * @description Update a list of food requests
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    all_food_requests_post: async (req, res, next) => {
        res.locals.query = req.body;

        let recIds = req.body.record_ids.split(',');

        const dynamicFields = [
            "FirstName",
            "LastName",
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

        const errors = false

        if (errors) {
            var extractedErrors = mapFieldErrors(errors);
           
            return res.redirect(
                "exceptions/" + req.body.uprn + "?" +
                querystring.stringify(extractedErrors) +
                "&" +
                querystring.stringify(req.body)
            );
        } else {
            try {
                let recordsData = [];

                recIds.forEach( id => {
                    let recFields = {};

                    recFields.id = id;

                    dynamicFields.forEach(field => {
                        recFields[field] = req.body[field + "_" + id];
                    });

                    recFields.OngoingFoodNeed = req.body["OngoingFoodNeed_" + id] === 'yes' ? true : false;

                    const updatedCaseNotes = notesfooder.appendNote(req.auth.name, req.body["NewCaseNote_" + id], req.body["CaseNotes_" + id]);

                    recFields.CaseNotes = updatedCaseNotes;

                    recordsData.push(recFields);
                });

                // Update all the food Request records
                await FoodRequestsService.updateAllFoodRequests(recordsData)
                .then(result => {
                    return res.redirect("/food-requests/exceptions");
                })  

            } catch (err) {
                const error = new Error(err);
    
                return next(error);
            }
        }
    }
};