const axios = require('axios');

const config = require('../config');

class ExceptionsModel {

   
    /**
     * @description Fetch all exception records
     * @returns {Promise<*>}
     */
    async fetchAllExceptions() {

        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.api_key
            };

            await axios.get(config.api_url + 'exceptions', {
                headers: headers
            }).then ( result => {
                data = result;
            });

            return data;

        } catch (err) {
            console.log('ExceptionsModel fetchAllExceptions ERR');
            console.log(err)
            return (err)
        }
    }

}

module.exports = new ExceptionsModel;