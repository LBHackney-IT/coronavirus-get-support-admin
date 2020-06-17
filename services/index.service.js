const HelpRequestModel = require('../models/help_request.model');

class IndexService {

    async getAnnexSummary() {
        try {
            let data = [];

            await HelpRequestModel.getAnnexSummary()
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