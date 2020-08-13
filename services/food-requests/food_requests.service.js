const FoodRequestModel = require('../../models/food-requests/food_request.model');
const notesHelper = require('../../helpers/notes');
const dateHelper = require('../../helpers/date');


class FoodRequestsService {

    /**
     * @description Get the Food Request summary data
     * @returns {Promise<*>}
     */
    async getAnnexSummary() {
        try {
            let data = [];

            await FoodRequestModel.getAnnexSummary()
            .then ( (result) => {
                data = result.data || [];
            });

            return data;
            
        } catch (err) {
            console.log(err);
        }
    }
    

    /**
     * @description Fetch all food request records using UPRN
     * @returns {Promise<*>}
     */

    async getAllFoodRequests(params) {

        try {
            let data = [];

            await FoodRequestModel.getAllFoodRequests(params)
            .then ( (result) => {
                data = result.data || [];
            });

            return data;
            
        } catch (err) {
            console.log(err);
        }
    }


    /**
     * @description Fetch a single food request using the Annex ID
     * @returns {Promise<*>}
     */
    async getFoodRequest(id) {
        try {
            let data = [];

            await FoodRequestModel.getFoodRequest(id)
            .then ( (result) => {
                data = result.data;

                data.OngoingFoodNeed = data.OngoingFoodNeed === true ? "yes" : "no";
                
                if (data.LastConfirmedFoodDelivery) {
                    const lastConfirmedFoodDelivery = new Date(data.LastConfirmedFoodDelivery);
                    const formattedDeliveryDate = dateHelper.convertDate(data.LastConfirmedFoodDelivery);

                    data.last_confirmed_food_delivery_date = formattedDeliveryDate.concatenated;
                    
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
     * @description Update a single food request
     * @returns {Promise<*>}
     */
    async updateFoodRequest(query, userName, isAdmin) {
        try {
            let data = [];

            const id = query.Id;
            const day = query.last_confirmed_food_delivery_day;
            const month = query.last_confirmed_food_delivery_month;
            const year = query.last_confirmed_food_delivery_year;
            const lastConfirmedDeliveryDate = new Date(Date.UTC(year, month - 1, day));

            const updatedCaseNotes = notesHelper.appendNote(userName, query.NewCaseNote, query.CaseNotes);

            const updatedFields = {
                OngoingFoodNeed: query.OngoingFoodNeed == "yes" && true || false,
                ContactTelephoneNumber: query.ContactTelephoneNumber || '',
                ContactMobileNumber: query.ContactMobileNumber || '',
                LastConfirmedFoodDelivery: lastConfirmedDeliveryDate.toISOString(),
                DeliveryNotes: query.DeliveryNotes,
                CaseNotes: updatedCaseNotes
            };

            let updatedAdminFields = {};

            if(isAdmin) {
                updatedAdminFields = {
                    FirstName: query.FirstName,
                    LastName: query.LastName,
                    AddressFirstLine: query.AddressFirstLine,
                    AddressSecondLine: query.AddressSecondLine,
                    AddressThirdLine: query.AddressThirdLine,
                    Postcode: query.Postcode,
                    Uprn: query.Uprn,
                    DobDay: query.DobDay,
                    DobMonth: query.DobMonth,
                    DobYear: query.DobYear,
                    EmailAddress: query.EmailAddress,
                    RecordStatus: query.RecordStatus,
                    IsDuplicate: query.IsDuplicate
                }
            }

            const updatedData = JSON.stringify(Object.assign({}, updatedFields, updatedAdminFields));

            await FoodRequestModel.updateFoodRequest(id, updatedData)
            .then ( (result) => {
                data = result.data;
            });

            return data;

        } catch (err) {
            console.log(err);
        }
    }


    /**
     * @description Update multiple food requests
     * @returns {Promise<*>}
     */
    async updateAllFoodRequests(FoodRequestsData) {
        try {
            let data = [];

            await FoodRequestModel.updateAllFoodRequests(FoodRequestsData)
            .then ( (result) => {
                data = result.data;
            });
            
            return data;

        } catch (err) {
            console.log(err);
        }
    }

}

module.exports = new FoodRequestsService;