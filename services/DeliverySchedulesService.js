const DeliveryScheduleModel = require('../models/DeliveryScheduleModel');

class DeliverySchedulesService {

    /**
     * @description Fetch all help request records using UPRN
     * @returns {Promise<*>}
     */

    async fetchDeliveryScheduleRecords(params) {
        try {
            let data = [];

            await DeliveryScheduleModel.fetchDeliveryScheduleRecords(params)
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