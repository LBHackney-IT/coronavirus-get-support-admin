const HelpRequestModel = require('../models/HelpRequestModel');

class HelpRequestsService {

    /**
     * @description Fetch all help request records using UPRN
     * @returns {Promise<*>}
     */

    async fetchAllHelpRequests(params) {
        try {
            let data = [];

            await HelpRequestModel.fetchAllHelpRequests(params)
            .then ( (result) => {
                data = result;
            });

            return data;
            
        } catch (err) {
            console.log(err);
        }
    }


    /**
     * @description Fetch a single help request using the Annex ID
     * @returns {Promise<*>}
     */
    async fetchHelpRequest(id) {
        try {
            let data = [];

            await HelpRequestModel.fetchHelpRequest(id)
            .then ( (result) => {
                data = result;
            });

            return data;

        } catch (err) {
            console.log(err);
        }
    }


    /**
     * @description Update a single help request
     * @returns {Promise<*>}
     */
    async updateHelpRequest(id, helpRequestData) {
        try {
            let data = [];

            await HelpRequestModel.updateHelpRequest(id, helpRequestData)
            .then ( (result) => {
                data = result;
            });

            return data;

        } catch (err) {
            console.log(err);
        }
    }


    /**
     * @description Update multiple help requests
     * @returns {Promise<*>}
     */
    async updateAllHelpRequests(helpRequestsData) {
        try {
            let data = [];

            await HelpRequestModel.updateAllHelpRequests(helpRequestsData)
            .then ( (result) => {
                data = result;
            });
            
            return data;

        } catch (err) {
            console.log(err);
        }
    }

    /**
     * @description Get all Exception help requests
     * @returns {Promise<*>}
     */
    async fetchAllExceptions() {
        try {
            let data = [];

            await HelpRequestModel.fetchAllExceptions()
            .then ( (result) => {                
                data = result;
            });

            return data;
            
        } catch (err) {
            console.log(err);
        }
    }

}

module.exports = new HelpRequestsService;