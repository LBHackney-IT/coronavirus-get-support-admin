const HelpRequestModel = require('../models/HelpRequestModel');

class HelpRequestsService {

    /**
     * @description Fetch all help request records using UPRN
     * @returns {Promise<*>}
     */

    async fetchAllHelpRequests(uprn) {
        try {
            let data = [];

            await HelpRequestModel.fetchAllHelpRequests(uprn)
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
     * @description Fetch a single help request using the Annex ID
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

}

module.exports = new HelpRequestsService;