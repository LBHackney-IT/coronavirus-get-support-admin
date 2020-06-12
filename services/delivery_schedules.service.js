const DeliveryScheduleModel = require('../models/delivery_schedule.model');

const dateHelper = require('../helpers/date');

class DeliverySchedulesService {

    constructor() {
        
    }

    /**
     * @description Check if the next delivery schedule has already been generated
     * @returns {Promise<*>}
     */

    async checkDeliverySchedule() {
        try {
            let data = [];

            await DeliveryScheduleModel.getDeliverySchedule()
            .then ( (result) => {
                data = result.data || [];
            });

            return data;
            
        } catch (err) {
            console.log(err);
            return err;
        }
    }


    /**
     * @description Fetch data for the next delivery schedule
     * @param params {object}  
     * @returns {Promise<*>}
     */

    async getDeliveryScheduleData(params) {
        try {
            let data = [];

            params.confirmed = false;

            await DeliveryScheduleModel.getDeliveryScheduleData(params)
            .then ( (result) => {
                data = result.data || [];

                data.forEach(item => {
                    const formattedDeliveryDate = dateHelper.convertDate(item.DeliveryDate);
                    item.deliveryDate = formattedDeliveryDate.concatenated;
                });
            });

            return data;
            
        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    }


    /**
     * @description Confirm the next delivery schedule
     * @param params [object}  
     * @returns {Promise<*>}
     */

    async confirmDeliverySchedule(params) {
        try {
            let data = [];

            params.confirmed = true;

            await DeliveryScheduleModel.getDeliveryScheduleData(params)
            .then ( (result) => {
                data = result.data || [];
            });

            return data;
            
        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    }


    /**
     * @description Delete the next delivery schedule
     * @param params [object}  
     * @returns {Promise<*>}
     */

    async deleteDeliverySchedule(params) {
        try {
            let data = [];

            await DeliveryScheduleModel.deleteDeliverySchedule(params)
            .then ( (result) => {
                data = result.data || [];
            });

            return data;
            
        } catch (err) {
            const error = new Error(err);

            return next(error);
        }
    }
}

module.exports = new DeliverySchedulesService;