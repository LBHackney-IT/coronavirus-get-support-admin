const ExceptionsModel = require('../models/ExceptionsModel');

class ExceptionsService {

    async fetchAllExceptions() {
        try {
            let data = [];

            await ExceptionsModel.fetchAllExceptions()
            .then ( (result) => {
                data = result;
            });

            return data;
            
        } catch (err) {
            console.log(err);
        }
    }

}

module.exports = new ExceptionsService;