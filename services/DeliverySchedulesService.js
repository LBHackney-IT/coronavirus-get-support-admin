const DeliveryScheduleModel = require('../models/DeliveryScheduleModel');

class DeliverySchedulesService {

    /**
     * @description Fetch data for the next delivery schedule
     * @returns {Promise<*>}
     */

    async fetchDeliveryScheduleData(params) {
        try {
            let data = [];

            params.confirmed = false;

            await DeliveryScheduleModel.fetchDeliveryScheduleData(params)
            .then ( (result) => {
                data = result;
            });

            return data;
            
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * @description Confirm the next delivery schedule
     * @returns {Promise<*>}
     */

    async confirmDeliverySchedule(params) {
        try {
            let data = [];

            params.confirmed = true;

            await DeliveryScheduleModel.fetchDeliveryScheduleData(params)
            .then ( (result) => {
                data = result;
            });

            return data;
            
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new DeliverySchedulesService;