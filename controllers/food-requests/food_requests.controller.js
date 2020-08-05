"use strict";

const validator = require('express-validator');
const querystring = require('querystring');

const FoodRequestsService = require('../../services/food-requests/food_requests.service');
const { mapFieldErrors } = require('../../helpers/fieldErrors');

module.exports = {

     /**
     * @description Display the Food Request home page
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    index_get: async (req, res, next) => {

        try {
            let data = [];

            await FoodRequestsService.getAnnexSummary()
            .then(result => {
                data = result;

                res.locals.isAdmin = req.auth.isAdmin;

                return res.render("food-requests/index.njk", { annexSummary: data});
            })                

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }

    },  

     /**
     * @description Display a list of food requests
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    all_food_requests_post: async (req, res, next) => {
        res.locals.query = req.body;
        res.locals.isAdmin = req.auth.isAdmin;

        const searchBy = req.body.searchby;
        const postcode = req.body.postcode;
        const id = req.body.id;
        const masterOnly = req.body.masterOnly && req.body.masterOnly == 'NO' ? false : true;

        const errors = validator.validationResult(req);

        if (!errors.isEmpty()) {
            var extractedErrors = mapFieldErrors(errors);

            return res.redirect(
              "/food-requests/search?" +
                querystring.stringify(extractedErrors) +
                "&" +
                querystring.stringify(req.body)
            );
        } else {

            try {
                let data = [];

                if(searchBy === 'postcode') {

                    /**
                     * @param postcode: string - matching full or partial postcode
                     * @param master: boolean - specify whether to return only master records or all
                     */
                    await FoodRequestsService.getAllFoodRequests({postcode: postcode, master: masterOnly})
                    .then(result => {
                        data = result;

                        data.forEach(item => {
                            const recDate = new Date(item.DateTimeRecorded);
                            item.DateTimeRecorded = recDate.toLocaleDateString();
                        });

                        return res.render('food-requests/food-requests-list.njk', {title: 'Home', searchBy: searchBy, postcode: postcode, id: id, foodRequestsData: data});
                    })  
                
                } else {
                    await FoodRequestsService.getFoodRequest(id)
                    .then(result => {
                        res.render('food-requests/food-request-edit.njk', {query: result});
                    })
                }

            } catch (err) {
                const error = new Error(err);

                return next(error);
            }
        }
    },    


    /**
     * @description Render a specific food request
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    food_request_get: async (req, res, next) => {
        try {
            res.locals.isAdmin = req.auth.isAdmin;

            if(req.query.Id) {
                res.locals.query = req.query;

                return res.render('food-requests/food-request-edit.njk');

            } else {
                await FoodRequestsService.getFoodRequest(req.params.id)
                .then(result => {
                    res.render('food-requests/food-request-edit.njk', {query: result});
                })
            }

        } catch (err) {
            
            const error = new Error(err);

            return next(error);
        }

    }, 


    /**
     * @description Update a specific food request
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    food_request_update_post: async (req, res, next) => {
        res.locals.query = req.body;
        res.locals.isAdmin = req.auth.isAdmin;

        const errors = validator.validationResult(req);

        if (!errors.isEmpty()) {
            var extractedErrors = mapFieldErrors(errors);

            return res.redirect(
              "/food-requests/edit/" + req.body.Id + "?" +
                querystring.stringify(extractedErrors) +
                "&" +
                querystring.stringify(req.body)
            );
          } else {

            try {
                const query = req.body;
                const userName = req.auth.name
                const Uprn = query.Uprn;
                const Id = query.Id;

                await FoodRequestsService.updateFoodRequest(query, userName, req.auth.isAdmin)
                .then(result => {
                    return res.render('food-requests/food-requests-update.njk', {updatedData: result, Uprn: Uprn, Id: Id});
                })                

            } catch (err) {
                const error = new Error(err);

                return next(error);
            }
        }
    }       
};