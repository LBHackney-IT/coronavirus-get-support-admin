const axios = require('axios');

const config = require('../config');

class HelpRequestModel {

    constructor() {
        
    }
    
    /**
     * @description Fetch all help request records using UPRN
     * @returns {Promise<*>}
     */
    async fetchAllHelpRequests(uprn) {

        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.api_key
            };

            await axios.get(config.api_url, {
                headers: headers,
                params: {
                    uprn: uprn
                }
            }).then ( result => {
                data = result;
            });

            return data;

        } catch (err) {
            console.log('HelpRequestModel fetchAllHelpRequests ERR');
            console.log(err)
            return (err)
        }
    }

    /**
     * @description Fetch a single help request using the Annex ID
     * @returns {Promise<*>}
     */
    async fetchHelpRequest(id) {

        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.api_key
            };

            data = await axios.get(config.api_url + id, {
                headers: headers
            });

            return data;

        } catch (err) {
            console.log('HelpRequestModel updateHelpRequest ERR');
            console.log(err)
            return (err)
        }
    }


    /**
     * @description Fetch a single help request using the Annex ID
     * @returns {Promise<*>}
     */
    async updateHelpRequest(id, helpRequestdata) {

        try {
            let data = {};

            const headers = {
                "Content-Type": "application/json",
                "Content-Length": helpRequestdata.length,
                "x-api-key": config.api_key
            };

            data = await axios.patch(config.api_url + id, helpRequestdata, {
                headers: headers
            })

            return data;

        } catch (err) {
            console.log('HelpRequestModel updateHelpRequest ERR');
            console.log(err)
            return (err)
        }
    }
}

module.exports = new HelpRequestModel;