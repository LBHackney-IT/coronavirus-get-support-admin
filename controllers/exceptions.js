const validator = require('express-validator');
const querystring = require('querystring');

const exceptionsService = require('../services/ExceptionsService');

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

            await exceptionsService.fetchAllExceptions()
            .then(result => {
                data = result.data;

                data.forEach(item => {
                    const recDate = new Date(item.DateTimeRecorded);
                    item.DateTimeRecorded = recDate.toLocaleDateString();
                });

                return res.render('exceptions.njk', {exceptionsData: data});
            })                

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    }
};