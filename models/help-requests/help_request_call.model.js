const axios = require("axios");

const config = require("../../config");
const { handleAPIErrors } = require("../../helpers/error");

class HelpRequestCallModel {
  constructor() {}
  /**
   * @description Create a new help request
   * @helpRequestdata json data
   * @returns {Promise<*>}
   */
  async createHelpRequestCall(id, helpRequestCalldata) {
    try {
      let data = {};

      const headers = {
        "Content-Type": "application/json",
        "Content-Length": helpRequestCalldata.length,
        "x-api-key": config.help_requests_api_key,
      };

      await axios
        .post(
          config.help_requests_api_url + "/" + id + "/calls",
          helpRequestCalldata,
          {
            headers: headers,
          }
        )
        .then((result) => {
          data = result;
        })
        .catch((err) => {
          data = handleAPIErrors(
            err,
            "Axios catch Error at HelpRequestCallModel: createHelpRequestCall()"
          );
          data.isError = true;
        });

      return data;
    } catch (err) {
      console.log("HelpRequestCallModel: createHelpRequestCall ERR");
      console.log(err);
      return err;
    }
  }
}

module.exports = new HelpRequestCallModel();
