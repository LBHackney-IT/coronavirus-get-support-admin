const HelpRequestModel = require('../models/HelpRequestModel');
const notesHelper = require('../helpers/notes');

class HelpRequestsService {

    /**
     * @description Fetch all help request records using UPRN
     * @returns {Promise<*>}
     */

    async fetchAllHelpRequests(params) {
        try {
            let data = [];

            await HelpRequestModel.fetchAllHelpRequests(params)
            .then ( (result) => {
                data = result;
            });

            return data;
            
        } catch (err) {
            console.log(err);
        }
    }


    /**
     * @description Fetch a single help request using the Annex ID
     * @returns {Promise<*>}
     */
    async fetchHelpRequest(id) {
        try {
            let data = [];

            await HelpRequestModel.fetchHelpRequest(id)
            .then ( (result) => {
                data = result.data;

                data.OngoingFoodNeed = data.OngoingFoodNeed === true ? "yes" : "no";

                if (data.LastConfirmedFoodDelivery) {
                    const lastConfirmedFoodDelivery = new Date(data.LastConfirmedFoodDelivery);
                    
                    data.last_confirmed_food_delivery_day = lastConfirmedFoodDelivery.getDate();
                    data.last_confirmed_food_delivery_month = lastConfirmedFoodDelivery.getMonth() + 1;
                    data.last_confirmed_food_delivery_year = lastConfirmedFoodDelivery.getFullYear();
                }
            });

            return data;

        } catch (err) {
            console.log(err);
        }
    }


    /**
     * @description Update a single help request
     * @returns {Promise<*>}
     */
    async updateHelpRequest(query, userName) {
        try {
            let data = [];

            const id = query.Id;
            const day = query.last_confirmed_food_delivery_day;
            const month = query.last_confirmed_food_delivery_month;
            const year = query.last_confirmed_food_delivery_year;
            const lastConfirmedDeliveryDate = new Date(Date.UTC(year, month - 1, day));

            const updatedCaseNotes = notesHelper.appendNote(userName, query.NewCaseNote, query.CaseNotes);

            const updatedData = JSON.stringify({
                OngoingFoodNeed: query.OngoingFoodNeed == "yes" && true || false,
                ContactTelephoneNumber: query.ContactTelephoneNumber || '',
                ContactMobileNumber: query.ContactMobileNumber || '',
                LastConfirmedFoodDelivery: lastConfirmedDeliveryDate.toISOString(),
                DeliveryNotes: query.DeliveryNotes,
                CaseNotes: updatedCaseNotes
            });

            await HelpRequestModel.updateHelpRequest(id, updatedData)
            .then ( (result) => {
                data = result;
            });

            return data;

        } catch (err) {
            console.log(err);
        }
    }


    /**
     * @description Update multiple help requests
     * @returns {Promise<*>}
     */
    async updateAllHelpRequests(helpRequestsData) {
        try {
            let data = [];

            await HelpRequestModel.updateAllHelpRequests(helpRequestsData)
            .then ( (result) => {
                data = result;
            });
            
            return data;

        } catch (err) {
            console.log(err);
        }
    }

    /**
     * @description Get all Exception help requests
     * @returns {Promise<*>}
     */
    async fetchAllExceptions() {
        try {
            let data = [];

            await HelpRequestModel.fetchAllExceptions()
            .then ( (result) => {                
                data = result;
            });

            return data;
            
        } catch (err) {
            console.log(err);
        }
    }

}

module.exports = new HelpRequestsService;