const indexService = require('../services/index.service');


module.exports = {

    /**
     * @description Display a list of help requests
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    index_get: async (req, res, next) => {

        try {
            let data = [];

            /**
             * postcode: string - matching full or partial postcode
             * master: boolean - specify whether to return only master records or all
             */
            await indexService.getAnnexSummary()
            .then(result => {
                data = result;

                res.locals.isAdmin = req.auth.isAdmin;

                return res.render("index.njk", { annexSummary: data});
            })                

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }

    },  


}