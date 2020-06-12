const axios = require('axios');

const config = require('../config');
const { handleAPIErrors } = require('../helpers/error');

class DeliveryScheduleModel {

    constructor() {
        
    }

    /**
     * @description Check if there is a delivry report has already been generated
     * @returns {Promise<*>}
     */
    async getDeliverySchedule() {
        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.api_key
            };

            await axios.get(config.delivery_batch_api_url, {
                headers: headers
            }).then ( result => {
                data = result;
            }).catch(err => {
                console.log('CATCH AXIOS Error at fetchCurrentDeliverySchedule MODEL');
                console.log(err);
                // handleAPIErrors(err);
            });

            return data;

        } catch (err) {
            console.log('CATCH fetchCurrentDeliverySchedule MODEL ERR');
            console.log(err);
            return (err);
        }
    }

    
    /**
     * @description Fetch records for the next scheduled food delivery, or the CSV file URL
     * @param params [object}  
     * @returns {Promise<*>}
     */
    async getDeliveryScheduleData(params) {
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
            }).catch(err => handleAPIErrors(err));

            return data;

        } catch (err) {
            console.log('DeliveryScheduleModel fetchDeliveryScheduleRecords ERR');
            console.log(err)
            return (err)
        }
    }


    /**
     * @description Delete the current delivery shedule repoprt
     * @param params [object}  
     * @returns {Promise<*>}
     */
    async deleteDeliverySchedule(params) {
        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.api_key
            };

            await axios.delete(config.delivery_api_url, {
                headers: headers,
                params: params
            }).then ( result => {
                data = result;
            }).catch(err => handleAPIErrors(err));

            return data;

        } catch (err) {
            console.log('DeliveryScheduleModel fetchDeliveryScheduleRecords ERR');
            console.log(err)
            return (err)
        }
    }

}

module.exports = new DeliveryScheduleModel;