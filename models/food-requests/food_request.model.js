const axios = require('axios');

const config = require('../../config');
const { handleAPIErrors } = require('../../helpers/error');

class FoodRequestModel {

    constructor() {
        
    }
    
    /**
     * @description Fetch all food request records matching the params
     * @returns {Promise<*>}
     */
    async getAllFoodRequests(params) {

        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.food_requests_api_key
            };

            await axios.get(config.food_requests_api_url, {
                headers: headers,
                params: params
            }).then ( result => {
                data = result;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Error at FoodRequestModel: fetchAllFoodRequests())');
                data.isError = true;
            });

            return data;

        } catch (err) {
            console.log('FoodRequestModel: fetchAllFoodRequests() ERR');
            console.log(err);
            return (err);
        }
    }

    /**
     * @description Fetch a single food request using the Annex ID
     * @returns {Promise<*>}
     */
    async getFoodRequest(id) {

        try {
            let data = [];

            const headers = {
                "Content-Type": "application/json",
                "x-api-key": config.food_requests_api_key
            };

            await axios.get(config.food_requests_api_url + '/' + id, {
                headers: headers
            }).then ( result => {
                data = result;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Error at FoodRequestModel: getFoodRequest())');
                data.isError = true;
            });

            return data;

        } catch (err) {
            console.log('FoodRequestModel: getFoodRequest ERR');
            console.log(err);
            return (err);
        }
    }


    /**
     * @description Update a single food request using the Annex ID
     * @returns {Promise<*>}
     */
    async updateFoodRequest(id, FoodRequestdata) {

        try {
            let data = {};

            const headers = {
                "Content-Type": "application/json",
                "Content-Length": FoodRequestdata.length,
                "x-api-key": config.food_requests_api_key
            };

            await axios.patch(config.food_requests_api_url + '/' + id, FoodRequestdata, {
                headers: headers
            }).then ( result => {
                data = result;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Error at FoodRequestModel: updateFoodRequest()');
                data.isError = true;
            });

            return data;            

        } catch (err) {
            console.log('FoodRequestModel: updateFoodRequest ERR');
            console.log(err);
            return (err);
        }
    }


    /**
     * @description Update multiple food requests
     * @returns {Promise<*>}
     */
    async updateAllFoodRequests(FoodRequestsdata) {

        try {
            let apiRequests = [],
                data = [];

            FoodRequestsdata.forEach(item => {
                const data = JSON.stringify(item);

                const headers = {
                    "Content-Type": "application/json",
                    "Content-Length": data.length,
                    "x-api-key": config.food_requests_api_key
                };

                const apiRequest = axios.patch(config.food_requests_api_url + '/' + item.id, data, {
                    headers: headers
                });

                apiRequests.push(apiRequest);
            });

            await axios.all(apiRequests)
            .then ( axios.spread((result) => {
                data = result;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Errorat FoodRequestModel: updateAllFoodRequests()');
                data.isError = true;
            }));
            
            return data;

        } catch (err) {
            console.log('FoodRequestModel updateAllFoodRequests ERR');
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
                "x-api-key": config.food_requests_api_key
            };

            await axios.get(config.food_requests_api_url + '/exceptions', {
                headers: headers
            }).then ( (results) => {
                data = results;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Error at FoodRequestModel: getAllExceptions()');
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
                "x-api-key": config.food_requests_api_key
            };

            await axios.get(config.annex_summary_api_url, {
                headers: headers
            }).then ( result => {
                data = result;
            }).catch(err => {
                data = handleAPIErrors(err, 'Axios catch Error at FoodRequestModel: getAnnexSummary()');
                data.isError = true;
            });

            return data;

        } catch (err) {
            console.log('FoodRequestModel: fetchAllFoodRequests() ERR');
            console.log(err);
            return (err);
        }
    }
}

module.exports = new FoodRequestModel;