const axios = require('axios');

const config = require('../../config');
const { handleAPIErrors } = require('../../helpers/error');

const SNAPSHOT_URL = process.env.SNAPSHOT_URL

class HelpRequestModel {

    constructor() {
        
    }


    /**
     * @description Fetch all callbacks using params
     * @param params {object} 
     * @returns {Promise<*>}
     */
    async getAllCallbacks(params) {
        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.help_requests_api_key
            };

            await axios.get(config.help_requests_callback_api_url, {
                headers: headers,
                params: params
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
     * @param params {object} 
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
     * @param id String Record Id 
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
     * @description Create a new help request
     * @helpRequestdata json data
     * @returns {Promise<*>}
     */
    async createHelpRequest(helpRequestdata) {

        try {
            let data = {};

            const headers = {
                "Content-Type": "application/json",
                "Content-Length": helpRequestdata.length,
                "x-api-key": config.help_requests_api_key
            };

            await axios.post(config.help_requests_api_url, helpRequestdata, {
                headers: headers
            }).then ( result => {
                data = result;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Error at HelpRequestModel: createHelpRequest()');
                data.isError = true;
            });

            return data;            

        } catch (err) {
            console.log('HelpRequestModel: createHelpRequest ERR');
            console.log(err);
            return (err);
        }
    }


    /**
     * @description Update a single help request using the record ID
     * @param id string Record Id
     * @helpRequestdata json data
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

    async makeSnapshotApiCall (endpoint, data) {
        try {
            const headers = {
                'Content-Type': 'application/json',
            }

            await axios.post(SNAPSHOT_URL + endpoint, data, {
                headers: headers
            })
              .then(response => {
                  data = response
              }).catch(err => {
                  data = handleAPIErrors(err, 'Axios catch Error at HelpRequestModel: ${endpoint}')
                  data.isError = true
              })

            return data

        } catch (err) {
            console.log('Snapshot API error')
            console.log(err)
            return (err)
        }
    }

    /**
     * Makes an API call to the Snapshot tool to create a record of the resident for a Snapshot
     * @description
     * @returns {Promise<*>}
     */
    async createVulnerabilitySnapshot (data) {
        return this.makeSnapshotApiCall('/api/snapshots', data)
    }


    /**
     * Makes an API call to the Snapshot tool to find a Snapshot record for the resident
     * @description
     * @returns {Promise<*>}
     */
    async findVulnerabilitySnapshot (data) {
        return this.makeSnapshotApiCall('/api/snapshots/find', data)
    }
}

module.exports = new HelpRequestModel;