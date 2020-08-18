"use strict";

const validator = require('express-validator');
const querystring = require('querystring');

const HelpRequestsService = require('../../services/help-requests/help_requests.service');
const { mapFieldErrors, mapDescriptionHtml } = require('../../helpers/fieldErrors');

const SERVER_ERROR_MSG = "Sorry, there is a problem with the service. Try again later"

const SNAPSHOT_URL = process.env.SNAPSHOT_URL

/**
 * Common functionality to handle a snapshot creation
 * @param query
 * @param res
 */
const handleSnapshotCreation = (query, userName, res) => {
      const requestModel = {
          inhId: query.id,
          firstName: query.FirstName,
          lastName: query.LastName,
          postcode: query.postcode
      }

    HelpRequestsService.createVulnerabilitySnapshot(requestModel, userName)
      .then(result => {
          if (!result) {
              return next(new Error("Could not create Snapshot for resident, but the resident form has been saved"));
          }
          return res.redirect(SNAPSHOT_URL + "/snapshots/" + result.id);
      })
};

module.exports = {
     /**
     * @description Display the Help Request home page
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    index_get: async (req, res, next) => {
        res.locals.isAdmin = req.auth.isAdmin;

        return res.render("help-requests/index.njk");

    },  

     /**
     * @description Render all hlp requests needing a callback
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    all_callbacks_get: async (req, res, next) => {
        try {

            await HelpRequestsService.getAllCallbacks({master: true})
            .then(result => {
                res.render('help-requests/help-requests-callbacks-list.njk', {helpRequestsData: result});
            })

        } catch (err) {
            
            const error = new Error(err);

            return next(error);
        }

    }, 


     /**
     * @description Search for help requests by postcode
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    search_help_requests_post: async (req, res, next) => {
        res.locals.query = req.body;

        const postcode = req.body.postcode;
        const id = req.body.id;

        const errors = validator.validationResult(req);

        if (!errors.isEmpty()) {
            var extractedErrors = mapFieldErrors(errors);
            let descriptionHtml = mapDescriptionHtml(errors)
            return res.redirect(
              "/help-requests/search?" +
                querystring.stringify(extractedErrors) +
                "&" +
                querystring.stringify(req.body) +
                "&descriptionHtml=" + descriptionHtml
            );
        } else {

            try {
                let data = [];

                /**
                 * @param postcode: string - matching full or partial postcode
                 */
                await HelpRequestsService.getAllHelpRequests({postcode: postcode})
                .then(result => {
                    data = result;

                    data.forEach(item => {
                        const recDate = new Date(item.DateTimeRecorded);
                        item.DateTimeRecorded = recDate.toLocaleDateString();
                    });

                    return res.render('help-requests/help-requests-list.njk', {postcode: postcode, id: id, helpRequestsData: data});
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

            if(req.query.haserrors) {
                res.locals.query = req.query;

                return res.render('help-requests/help-request-edit.njk');

            } else {
                await HelpRequestsService.getHelpRequest(req.params.id)
                .then(result => {
                    res.locals.hasupdated = req.query.hasupdated;
                    res.render('help-requests/help-request-edit.njk', {query: result, hasupdated: req.query.hasupdated});
                })
            }

        } catch (err) {
            
            const error = new Error(err);

            return next(error);
        }

    },


    /**
     * @description Render a specific help request complete page
     * @param req {object} Express req object
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    help_request_complete: async (req, res, next) => {
        try {
            if(req.query.haserrors) {
                res.locals.query = req.query;
                return res.render('help-requests/help-request-complete.njk');
            } else {
                await HelpRequestsService.getHelpRequest(req.params.id)
                  .then(result => {
                      res.locals.hasupdated = req.query.hasupdated;
                      res.render('help-requests/help-request-complete.njk', {query: result, hasupdated: req.query.hasupdated});
                  })
            }
        } catch (err) {
            const error = new Error(err);
            return next(error);
        }
    },

    /**
     * @description Render a new help request form
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    help_request_create_get: async (req, res, next) => {
        res.locals.query = req.query;

        return res.render('help-requests/help-request-create.njk');
    }, 


    /**
     * @description Create a new help request
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    help_request_create_post: async (req, res, next) => {
        res.locals.query = req.body;

        const errors = validator.validationResult(req);

        if (!errors.isEmpty()) {
            var extractedErrors = mapFieldErrors(errors);
            let descriptionHtml = mapDescriptionHtml(errors)
            return res.redirect(
              "/help-requests/create?haserrors=true&" +
                querystring.stringify(extractedErrors) +
                "&" +
                querystring.stringify(req.body) +
                "&descriptionHtml=" + descriptionHtml
            );
        } else {

            const query = req.body;
            const userName = req.auth.name
            try {
                await HelpRequestsService.createHelpRequest(query, userName)
                .then(result => {
                    if(result.isError === true){
                        return res.redirect( "/help-requests/create?haserrors=true&" +
                          querystring.stringify(extractedErrors) +
                          "&" +
                          querystring.stringify(req.body) +
                          "&message=" + SERVER_ERROR_MSG);
                    }
                    console.log("Resident created successfully with ID: ", result.data.Id)
                    query.id = result.data.Id
                })
                .then(()=> handleSnapshotCreation(query, userName, res));

            } catch (err) {
                const error = new Error(err);
                return next(error);
            }
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
            var extractedErrors = mapFieldErrors(errors)
            let descriptionHtml = mapDescriptionHtml(errors)
            return res.redirect(
              "/help-requests/edit/" + req.body.Id + "?haserrors=true&descriptionHtml=" + descriptionHtml +
                "&" + querystring.stringify(extractedErrors) +
                "&" + querystring.stringify(req.body)
            );
          } else {

            try {
                const query = req.body;
                const userName = req.auth.name

                await HelpRequestsService.updateHelpRequest(query, userName)
                .then(result => {
                    if(result.isError === true){
                        return res.redirect('/help-requests/edit/' + query.Id + "/?haserrors=true&message="+ SERVER_ERROR_MSG +
                          "&" + querystring.stringify(req.body));
                    }
                    return res.redirect('/help-requests/edit/' + query.Id + "/?hasupdated=true");
                })                

            } catch (err) {
                const error = new Error(err);

                return next(error);
            }
        }
    },

    /**
     * @description Requests to edits a vulnerability snapshot for a resident
     *
     * @param req {object} Express req object
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    help_request_edit_snapshot: async (req, res, next) => {
        res.locals.query = req.body
        res.locals.isAdmin = req.auth.isAdmin

        try {
            const query = req.body
            const userName = req.auth.name

            const requestModel = {
                inhId: query.id,
                firstName: query.FirstName,
                lastName: query.LastName,
                postcode: query.postcode
            }
            await HelpRequestsService.findVulnerabilitySnapshot(requestModel, userName)
            .then(result => {
                if(result.snapshots && result.snapshots.length > 0) {
                    console.log(`Snapshot found, for resident ${query.firstName}  ${query.lastName}. Opening...`);
                    return res.redirect(SNAPSHOT_URL + "/snapshots/" + result.snapshots[0].id);
                } else {
                    console.log(`Snapshot not found, for resident ${query.firstName}  ${query.lastName}. Creating...`);
                    handleSnapshotCreation(query, userName, res)
                }
            })
        } catch (err) {
            const error = new Error(err)
            return next(error)
        }
    }
};