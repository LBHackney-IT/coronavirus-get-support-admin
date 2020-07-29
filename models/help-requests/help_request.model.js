const axios = require('axios');

const config = require('../../config');
const { handleAPIErrors } = require('../../helpers/error');

class HelpRequestModel {

    constructor() {
        
    }


    /**
     * @description Fetch all callbacks
     * @returns {Promise<*>}
     */
    async getAllCallbacks() {
        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.help_requests_api_key
            };

            await axios.get(config.help_requests_callback_api_url, {
                headers: headers
            }).then ( result => {
                data = result;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Error at HelpRequestModel: getAllCallbacks())');
                data.isError = true;
            });

            return data;

        } catch (err) {
            console.log('HelpRequestModel: getAllCallbacks() ERR');
            console.log(err);
            return (err);
        }
    }


    
    /**
     * @description Fetch all help request records matching the params
     * @returns {Promise<*>}
     */
    async getAllHelpRequests(params) {

        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.help_requests_api_key
            };

            await axios.get(config.help_requests_api_url, {
                headers: headers,
                params: params
            }).then ( result => {
                data = result;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Error at HelpRequestModel: fetchAllHelpRequests())');
                data.isError = true;
            });

            return data;

        } catch (err) {
            console.log('HelpRequestModel: fetchAllHelpRequests() ERR');
            console.log(err);
            return (err);
        }
    }

    /**
     * @description Fetch a single help request using the ID
     * @returns {Promise<*>}
     */
    async getHelpRequest(id) {

        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.help_requests_api_key
            };

            await axios.get(config.help_requests_api_url + '/' + id, {
                headers: headers
            }).then ( result => {
                data = result;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Error at HelpRequestModel: getHelpRequest())');
                data.isError = true;
            });

            return data;

        } catch (err) {
            console.log('HelpRequestModel: getHelpRequest ERR');
            console.log(err);
            return (err);
        }
    }


    /**
     * @description Update a single help request using the Annex ID
     * @returns {Promise<*>}
     */
    async updateHelpRequest(id, helpRequestdata) {

        try {
            let data = {};

            const headers = {
                "Content-Type": "application/json",
                "Content-Length": helpRequestdata.length,
                "x-api-key": config.help_requests_api_key
            };

            await axios.patch(config.help_requests_api_url + '/' + id, helpRequestdata, {
                headers: headers
            }).then ( result => {
                data = result;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Error at HelpRequestModel: updateHelpRequest()');
                data.isError = true;
            });

            return data;            

        } catch (err) {
            console.log('HelpRequestModel: updateHelpRequest ERR');
            console.log(err);
            return (err);
        }
    }


    
    
}

module.exports = new HelpRequestModel;