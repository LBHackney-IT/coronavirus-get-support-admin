const HelpRequestModel = require("../../models/help-requests/help_request.model");
const notesHelper = require("../../helpers/notes");
const dateHelper = require("../../helpers/date");

class HelpRequestsService {
  /**
   * @description Fetch all help request records using UPRN
   * @param params [object}
   * @returns {Promise<*>}
   */

  async getAllCallbacks(params) {
    try {
      let data = [];

      await HelpRequestModel.getAllCallbacks(params).then(result => {
        data = result.data || [];

        data.forEach(item => {
          const formattedCreationDate = dateHelper.convertDate(
            item.DateTimeRecorded
          );
          if (item.HelpRequestCalls) {
            item.calls = item.HelpRequestCalls.reverse();
          }
          item.creation_date = formattedCreationDate.concatenated;
        });
      });

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @description Fetch all help request records using UPRN
   * @param params [object}
   * @returns {Promise<*>}
   */

  async getAllHelpRequests(params) {
    try {
      let data = [];

      await HelpRequestModel.getAllHelpRequests(params).then(result => {
        data = result.data || [];

        data.forEach(item => {
          const formattedCreationDate = dateHelper.convertDate(
            item.DateTimeRecorded
          );

          item.creation_date = formattedCreationDate.concatenated;
        });
      });

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @description Fetch a single help request using the record ID
   * @param id Record Id
   * @returns {Promise<*>}
   */
  async getHelpRequest(id) {
    try {
      let data = [];

      await HelpRequestModel.getHelpRequest(id).then(result => {
        data = result.data;

        // Create new keys with yes/no values based on boolean input values
        data.initial_callback_completed =
          data.InitialCallbackCompleted === true ? "yes" : "no";
        data.callback_required = data.CallbackRequired === true ? "yes" : "no";
        data.consent_to_share = data.ConsentToShare === true ? "yes" : "no";

        // Build array of all values
        let what_coronavirus_help = [
          (data.HelpWithAccessingFood && "accessing food") || "",
          (data.HelpWithAccessingSupermarketFood && "food via supermarket") ||
            "",
          (data.HelpWithCompletingNssForm && "nss form support") || "",
          (data.HelpWithShieldingGuidance && "shielding guidance") || "",
          (data.HelpWithNoNeedsIdentified && "no needs") || "",
          (data.HelpWithDebtAndMoney && "debt and money") || "",
          (data.HelpWithHealth && "health") || "",
          (data.HelpWithMentalHealth && "mental health") || "",
          (data.HelpWithHousing && "housing") || "",
          (data.HelpWithAccessingInternet && "technology support") || "",
          (data.HelpWithSomethingElse && "something else") || ""
        ];

        // Remove empty values.
        data.what_coronavirus_help = what_coronavirus_help.filter(item => item);

        const formattedCreationDate = dateHelper.convertDate(
          data.DateTimeRecorded
        );

        data.creation_date = formattedCreationDate.concatenated;
        if (data.HelpRequestCalls) {
        data.HelpRequestCalls.forEach(call => {
          const formattedCreationDate = dateHelper.convertDate(
            call.CallDateTime
          );

          call.creation_date = formattedCreationDate.concatenated;
        })}
      });

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @description Update a single help request
   * @param query {object} Updated record data
   * @param userName Person who made the update
   * @returns {Promise<*>}
   */
  async updateHelpRequest(query, userName) {
    try {
      let data = [];

      query.what_coronavirus_help = query.what_coronavirus_help || [];
      const id = query.Id;
      const currentSupport = Array.isArray(query.CurrentSupport)
        ? query.CurrentSupport.join()
        : query.CurrentSupport;
      const updatedCaseNotes = notesHelper.appendNote(
        userName,
        query.NewCaseNote,
        query.CaseNotes
      );
      
      let initialCallBack = query.initialCallBack

      if (query.CallOutcome) {
        if(query.CallOutcome == "callback_complete" || query.CallOutcome == "refused_to_engage" || query.CallOutcome == "close_case"){
          initialCallBack = true
        }
        else if(query.CallOutcome.includes("follow_up_requested") || query.CallOutcome.includes("call_rescheduled")){
          initialCallBack = true
        }
      }

      const updatedFields = {
        InitialCallbackCompleted:initialCallBack,
        HelpNeeded: query.HelpNeeded || "",
        CallbackRequired: query.callback_required == "yes" ? true : query.callback_required == "no" ? false : undefined,
        FirstName: query.FirstName,
        LastName: query.LastName,
        ContactTelephoneNumber: query.ContactTelephoneNumber || "",
        ContactMobileNumber: query.ContactMobileNumber || "",
        EmailAddress: query.EmailAddress,
        DobDay: query.DobDay,
        DobMonth: query.DobMonth,
        DobYear: query.DobYear,
        AddressFirstLine: query.address_first_line,
        AddressSecondLine: query.address_second_line,
        AddressThirdLine: query.address_third_line,
        PostCode: query.postcode,
        Uprn: query.uprn,
        Ward: query.ward,
        GettingInTouchReason: query.GettingInTouchReason || "",
        HelpWithAccessingFood:
          (query.what_coronavirus_help.includes("accessing food") && true) ||
          false,
        HelpWithAccessingSupermarketFood:
          (query.what_coronavirus_help.includes("food via supermarket") &&
            true) ||
          false,
        HelpWithCompletingNssForm:
          (query.what_coronavirus_help.includes("nss form support") && true) ||
          false,
        HelpWithShieldingGuidance:
          (query.what_coronavirus_help.includes("shielding guidance") &&
            true) ||
          false,
        HelpWithNoNeedsIdentified:
          (query.what_coronavirus_help.includes("no needs") && true) || false,
        HelpWithDebtAndMoney:
          (query.what_coronavirus_help.includes("debt and money") && true) ||
          false,
        HelpWithHealth:
          (query.what_coronavirus_help.includes("health") && true) || false,
        HelpWithMentalHealth:
          (query.what_coronavirus_help.includes("mental health") && true) ||
          false,
        HelpWithHousing:
          (query.what_coronavirus_help.includes("housing") && true) || false,
        HelpWithAccessingInternet:
          (query.what_coronavirus_help.includes("technology support") &&
            true) ||
          false,
        HelpWithSomethingElse:
          (query.what_coronavirus_help.includes("something else") && true) ||
          false,
        CurrentSupport: currentSupport || "",
        CurrentSupportFeedback: query.CurrentSupportFeedback || "",
        GpSurgeryDetails: query.GpSurgeryDetails || "",
        NumberOfChildrenUnder18: query.NumberOfChildrenUnder18 || "",
        ConsentToShare: (query.consent_to_share && true) || false,
        CaseNotes: updatedCaseNotes
      };

      const updatedData = JSON.stringify(updatedFields);

      await HelpRequestModel.updateHelpRequest(id, updatedData).then(result => {
        data = result;
      });

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @description Patch the help request address fields
   * @param query {object} Updated record data
   * @param userName Person who made the update
   * @returns {Promise<*>}
   */
  async patchHelpRequestAddress(query, userName) {
    try {
      let data = [];

      const id = query.Id;

      const updatedFields = {
        AddressFirstLine: query.address_first_line,
        AddressSecondLine: query.address_second_line,
        AddressThirdLine: query.address_third_line,
        PostCode: query.postcode,
        Uprn: query.uprn,
        Ward: query.ward
      };

      const updatedData = JSON.stringify(updatedFields);

      await HelpRequestModel.updateHelpRequest(id, updatedData).then(result => {
        data = result;
      });

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @description Create a new help request
   * @param query {object} Record data
   * @param userName Person who created the record
   * @returns {Promise<*>}
   */
  async createHelpRequest(query, userName) {
    try {
      let data = [];

      const recordCreatedCaseNoteText = "*** CREATED ***";

      const currentSupport = Array.isArray(query.CurrentSupport)
        ? query.CurrentSupport.join()
        : query.CurrentSupport;

      let caseNotes = notesHelper.appendNote(
        userName,
        recordCreatedCaseNoteText,
        "[]"
      );

      const createFields = {
        InitialCallbackCompleted: false,
        HelpNeeded: query.HelpNeeded || "",
        CallbackRequired: true,
        FirstName: query.FirstName,
        LastName: query.LastName,
        ContactTelephoneNumber: query.ContactTelephoneNumber || "",
        ContactMobileNumber: query.ContactMobileNumber || "",
        AddressFirstLine: query.address_first_line || "",
        AddressSecondLine: query.address_second_line || "",
        AddressThirdLine: query.address_third_line || "",
        PostCode: query.postcode,
        Uprn: query.uprn,
        Ward: query.ward,
        EmailAddress: query.EmailAddress,
        DobDay: query.DobDay,
        DobMonth: query.DobMonth,
        DobYear: query.DobYear,
        GettingInTouchReason: query.GettingInTouchReason || "",
        HelpWithAccessingFood:
          (query.what_coronavirus_help &&
            query.what_coronavirus_help.includes("accessing food") &&
            true) ||
          false,
        HelpWithAccessingSupermarketFood:
          (query.what_coronavirus_help &&
            query.what_coronavirus_help.includes("food via supermarket") &&
            true) ||
          false,
        HelpWithCompletingNssForm:
          (query.what_coronavirus_help &&
            query.what_coronavirus_help.includes("nss form support") &&
            true) ||
          false,
        HelpWithShieldingGuidance:
          (query.what_coronavirus_help &&
            query.what_coronavirus_help.includes("shielding guidance") &&
            true) ||
          false,
        HelpWithNoNeedsIdentified:
          (query.what_coronavirus_help &&
            query.what_coronavirus_help.includes("no needs") &&
            true) ||
          false,
        HelpWithDebtAndMoney:
          (query.what_coronavirus_help &&
            query.what_coronavirus_help.includes("debt and money") &&
            true) ||
          false,
        HelpWithHealth:
          (query.what_coronavirus_help &&
            query.what_coronavirus_help.includes("health") &&
            true) ||
          false,
        HelpWithMentalHealth:
          (query.what_coronavirus_help &&
            query.what_coronavirus_help.includes("mental health") &&
            true) ||
          false,
        HelpWithHousing:
          (query.what_coronavirus_help &&
            query.what_coronavirus_help.includes("housing") &&
            true) ||
          false,
        HelpWithAccessingInternet:
          (query.what_coronavirus_help &&
            query.what_coronavirus_help.includes("technology support") &&
            true) ||
          false,
        HelpWithSomethingElse:
          (query.what_coronavirus_help &&
            query.what_coronavirus_help.includes("something else") &&
            true) ||
          false,
        CurrentSupport: currentSupport || "",
        CurrentSupportFeedback: query.CurrentSupportFeedback || "",
        GpSurgeryDetails: query.GpSurgeryDetails || "",
        NumberOfChildrenUnder18: query.NumberOfChildrenUnder18 || "",
        ConsentToShare: (query.consent_to_share && true) || false,
        CaseNotes: caseNotes,
        DateTimeRecorded: new Date()
      };

      const createData = JSON.stringify(createFields);

      await HelpRequestModel.createHelpRequest(createData).then(result => {
        data = result;
      });

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @description
   * @returns {Promise<*>}
   */
  async createVulnerabilitySnapshot(query, userName) {
    try {
      let data = [];
      const request = {
        firstName: query.firstName,
        lastName: query.lastName,
        dob: {},
        postcode: query.postcode,
        systemIds: [query.inhId.toString()],
        createdBy: userName
      };
      const createData = JSON.stringify(request);
      await HelpRequestModel.createVulnerabilitySnapshot(createData).then(
        result => {
          data = result.data;
        }
      );
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @description
   * @returns {Promise<*>}
   */
  async findVulnerabilitySnapshot(query) {
    try {
      let data = [];
      const request = {
        systemIds: [query.inhId.toString()],
        firstName: query.firstName,
        lastName: query.lastName
      };
      const findData = JSON.stringify(request);
      await HelpRequestModel.findVulnerabilitySnapshot(findData).then(
        result => {
          data = result.data;
        }
      );
      return data;
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = new HelpRequestsService();
