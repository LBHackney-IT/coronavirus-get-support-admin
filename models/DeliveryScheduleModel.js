const axios = require('axios');

const config = require('../config');

class DeliveryScheduleModel {

    constructor() {
        
    }
    
    /**
     * @description Fetch all food deliveries
     * @returns {Promise<*>}
     */
    async fetchDeliveryScheduleRecords(params) {
        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.api_key
            };

            await axios.get(config.delivery_api_url, {
                headers: headers,
                params: params
            }).then ( result => {
                data = result;
            });

            return data;

        } catch (err) {
            console.log('DeliveryScheduleModel fetchDeliveryScheduleRecords ERR');
            console.log(err)
            return (err)
        }
    }
}

module.exports = new DeliveryScheduleModel;