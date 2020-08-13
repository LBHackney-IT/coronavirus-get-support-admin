const FoodRequestModel = require('../../models/food-requests/food_request.model');
const notesHelper = require('../../helpers/notes');
const dateHelper = require('../../helpers/date');

class ExceptionsService {

    /**
     * @description Get all Exception food requests
     * @returns {Promise<*>}
     */
    async getAllExceptions() {
        try {
            let data = [];

            await FoodRequestModel.getAllExceptions()
            .then ( (result) => {
                data = result.data || [];

                data.forEach(item => {
                    const formattedCreationDate = dateHelper.convertDate(item.DateTimeRecorded);

                    item.creation_date = formattedCreationDate.concatenated;
                });
            });

            return data;
            
        } catch (err) {
            console.log(err);
        }
    }


    /**
     * @description Fetch all food request records with the same UPRN
     * @returns {Promise<*>}
     */

    async getAllMatchingFoodRequests(params) {
        try {
            let data = [];

            await FoodRequestModel.getAllFoodRequests(params)
            .then ( (result) => {
                let recordIDs = [];

                data = result.data || [];
                
                if (data.length) {
                    const dynamicFields = [
                        "FirstName",
                        "LastName",
                        "RecordStatus",
                        "IsDuplicate",
                        "OngoingFoodNeed",
                        "ContactTelephoneNumber",
                        "ContactMobileNumber",
                        "EmailAddress",
                        "NumberOfPeopleInHouse",
                        "DobDay",
                        "DobMonth",
                        "DobYear",
                        "DeliveryNotes",
                        "CaseNotes"
                    ];

                    let formattedCreationDate = {};

                    data.forEach(item => {
                        recordIDs.push(item.Id);

                        dynamicFields.forEach((fieldName) => {
                            item[fieldName + "_" + item.Id] = item[fieldName];
                        });

                        formattedCreationDate = dateHelper.convertDate(item.DateTimeRecorded);

                        item.creation_date = formattedCreationDate.concatenated;

                        if (item.LastConfirmedFoodDelivery) {
                            const formattedDeliveryDate = dateHelper.convertDate(item.LastConfirmedFoodDelivery);

                            item["last_confirmed_food_delivery_date_" + item.Id] = formattedDeliveryDate.concatenated;
                        }

                        data.AddressFirstLine = data[0].AddressFirstLine;
                        data.AddressSecondLine = data[0].AddressSecondLine;
                        data.Postcode = data[0].Postcode;
                    });

                    data.recordIDs = recordIDs.join(',');                    
                };
            });

            return data;
            
        } catch (err) {
            console.log(err);
        }
    }

    
}

module.exports = new ExceptionsService;