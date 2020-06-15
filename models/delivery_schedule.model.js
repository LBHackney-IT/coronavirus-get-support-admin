const axios = require('axios');

const config = require('../config');
const { handleAPIErrors } = require('../helpers/error');

class DeliveryScheduleModel {

    constructor() {
        
    }

    /**
     * @description Check if a delivery report has already been generated
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
                data = result.data;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Error at DeliveryScheduleModel: getDeliverySchedule()');
            });

            return data;

        } catch (err) {
            console.log('Catch DeliveryScheduleModel: getDeliverySchedule() ERR');
            console.log(err);
            return (err);
        }
    }

    
    /**
     * @description Fetch records for the next scheduled food delivery, or return the generated CSV file URL
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
                data = result.data;
            }).catch(err => {
                console.log();
                data = handleAPIErrors(err, 'Axios catch Error at DeliveryScheduleModel: getDeliveryScheduleData()');
            });

            return data;

        } catch (err) {
            console.log('Catch DeliveryScheduleModel: getDeliveryScheduleData() ERR');
            console.log(err)
            return (err)
        }
    }


    /**
     * @description Delete the current delivery shedule report
     * @param params [object}  
     * @returns {Promise<*>}
     */
    async deleteDeliverySchedule(id) {
        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.api_key
            };

            await axios.delete(config.delivery_api_url + '/' + id, {
                headers: headers
            }).then ( result => {
                data = result.data;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Error at DeliveryScheduleModel: deleteDeliverySchedule()');
            });

            return data;

        } catch (err) {
            console.log('Catch DeliveryScheduleModel: deleteDeliverySchedule ERR');
            console.log(err)
            return (err)
        }
    }

}

module.exports = new DeliveryScheduleModel;