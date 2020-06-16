"use strict";

const validator = require('express-validator');
const querystring = require('querystring');


const HelpRequestsService = require('../services/help_requests.service');
const { mapFieldErrors } = require('../helpers/fieldErrors');

module.exports = {

     /**
     * @description Display a list of help requests
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    all_help_requests_post: async (req, res, next) => {
        res.locals.query = req.body;
        const postcode = req.body.postcode;

        const errors = validator.validationResult(req);

        if (!errors.isEmpty()) {
            var extractedErrors = mapFieldErrors(errors);

            return res.redirect(
              "/help-requests?" +
                querystring.stringify(extractedErrors) +
                "&" +
                querystring.stringify(req.body)
            );
        } else {

            try {
                let data = [];

                /**
                 * postcode: string - matching full or partial postcode
                 * master: boolean - specify whether to return only master records or all
                 */
                await HelpRequestsService.getAllHelpRequests({postcode: postcode, master: true})
                .then(result => {
                    data = result;

                    data.forEach(item => {
                        const recDate = new Date(item.DateTimeRecorded);
                        item.DateTimeRecorded = recDate.toLocaleDateString();
                    });

                    return res.render('help-requests-list.njk', {title: 'Home', postcode: postcode, helpRequests: data});
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
            res.locals.isAdmin = req.auth.isAdmin;

            if(req.query.Id) {
                res.locals.query = req.query;

                return res.render('help-request-edit.njk');

            } else {
                await HelpRequestsService.getHelpRequest(req.params.id)
                .then(result => {
                    res.render('help-request-edit.njk', {query: result});
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
            var extractedErrors = mapFieldErrors(errors);

            return res.redirect(
              "/help-requests/edit/" + req.body.Id + "?" +
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

                await HelpRequestsService.updateHelpRequest(query, userName)
                .then(result => {
                    return res.render('help-requests-update.njk', {updatedData: result, Uprn: Uprn, Id: Id});
                })                

            } catch (err) {
                const error = new Error(err);

                return next(error);
            }
        }
    }       
};