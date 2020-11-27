const HelpRequestCallModel = require("../../models/help-requests/help_request_call.model");

class HelpRequestCallService {
  /**
   * @description Create a new help request
   * @param query {object} Record data
   * @param userName Person who created the record
   * @returns {Promise<*>}
   */
  async createHelpRequestCall(query, userName) {
    try {
      let data = [];
      const CallOutcome = Array.isArray(query.CallOutcome)
        ? query.CallOutcome.join()
        : query.CallOutcome;
      const CallDirection = query.CallDirection
        ? query.CallDirection
        : "outbound";
      const CallType = query.CallType ? query.CallType : query.HelpNeeded;
      const date = new Date();
      const Caller =
        CallDirection === "outbound"
          ? userName
          : `${query.FirstName} ${query.LastName}`;
      const createFields = {
        CallDirection: CallDirection,
        CallType: CallType,
        CallOutcome: CallOutcome,
        CallDateTime: date,
        Caller
      };

      const createData = JSON.stringify(createFields);

      await HelpRequestCallModel.createHelpRequestCall(
        query.Id,
        createData
      ).then((result) => {
        data = result;
      });

      return data;
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = new HelpRequestCallService();
