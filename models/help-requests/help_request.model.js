const axios = require('axios');

const config = require('../../config');
const { handleAPIErrors } = require('../../helpers/error');

class HelpRequestModel {

    constructor() {
        
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
                "x-api-key": config.api_key
            };

            await axios.get(config.api_url, {
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
     * @description Fetch a single help request using the Annex ID
     * @returns {Promise<*>}
     */
    async getHelpRequest(id) {

        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.api_key
            };

            await axios.get(config.api_url + '/' + id, {
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
                "x-api-key": config.api_key
            };

            await axios.patch(config.api_url + '/' + id, helpRequestdata, {
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


    /**
     * @description Update multiple help requests
     * @returns {Promise<*>}
     */
    async updateAllHelpRequests(helpRequestsdata) {

        try {
            let apiRequests = [],
                data = [];

            helpRequestsdata.forEach(item => {
                const data = JSON.stringify(item);

                const headers = {
                    "Content-Type": "application/json",
                    "Content-Length": data.length,
                    "x-api-key": config.api_key
                };

                const apiRequest = axios.patch(config.api_url + '/' + item.id, data, {
                    headers: headers
                });

                apiRequests.push(apiRequest);
            });

            await axios.all(apiRequests)
            .then ( axios.spread((result) => {
                data = result;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Errorat HelpRequestModel: updateAllHelpRequests()');
                data.isError = true;
            }));
            
            return data;

        } catch (err) {
            console.log('HelpRequestModel updateAllHelpRequests ERR');
            console.log(err);
            return (err);
        }
    }


    /**
     * @description Fetch all exception records
     * @returns {Promise<*>}
     */
    async getAllExceptions() {
        let data = [];

        try {          
            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.api_key
            };

            await axios.get(config.api_url + '/exceptions', {
                headers: headers
            }).then ( (results) => {
                data = results;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Error at HelpRequestModel: getAllExceptions()');
                data.isError = true;
            });

            return data;            

        } catch (err) {
            console.log('ExceptionsModel fetchAllExceptions ERR');
            console.log(err)
            return (err)
        }
    }


    /**
     * @description Fetch the Annex table summary stats
     * @returns {Promise<*>}
     */
    async getAnnexSummary() {

        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.api_key
            };

            await axios.get(config.annex_summary_api_url, {
                headers: headers
            }).then ( result => {
                data = result;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Error at HelpRequestModel: getAnnexSummary()');
                data.isError = true;
            });

            return data;

        } catch (err) {
            console.log('HelpRequestModel: fetchAllHelpRequests() ERR');
            console.log(err);
            return (err);
        }
    }
}

module.exports = new HelpRequestModel;