const indexService = require('../services/index.service');


module.exports = {

    /**
     * @description Display the home page
     * @param req {object} Express req object 
     * @param res {object} Express res object
     * @param next {object} Express next object
     * @returns {Promise<*>}
     */
    index_get: async (req, res, next) => {

        try {
            return res.render("index.njk");                

        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    }
}