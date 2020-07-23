const FoodRequestModel = require('../models/food-requests/food_request.model');

class IndexService {

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
}

module.exports = new IndexService;