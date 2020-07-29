const HelpRequestModel = require('../../models/help-requests/help_request.model');
const notesHelper = require('../../helpers/notes');
const dateHelper = require('../../helpers/date');

class HelpRequestsService {

    /**
     * @description Fetch all help request records using UPRN
     * @returns {Promise<*>}
     */

    async getAllCallbacks() {

        try {
            let data = [];

            await HelpRequestModel.getAllCallbacks()
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
     * @description Fetch all help request records using UPRN
     * @returns {Promise<*>}
     */

    async getAllHelpRequests(params) {

        try {
            let data = [];

            await HelpRequestModel.getAllHelpRequests(params)
            .then ( (result) => {
                data = result.data || [];
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
    async getHelpRequest(id) {
        try {
            let data = [];

            await HelpRequestModel.getHelpRequest(id)
            .then ( (result) => {
                data = result.data;

                data.consent_to_share = data.ConsentToShare === true ? "yes" : "no";
                data.consent_to_share = data.ConsentToShare === true ? "yes" : "no";

                // Build array of all values
                let what_coronavirus_help = [
                    data.HelpWithAccessingFood && 'accessing food' || '',
                    data.HelpWithDebtAndMoney && 'debt and money' || '',
                    data.HelpWithHealth && 'health' || '',
                    data.HelpWithMentalHealth && 'mental health' || '',
                    data.HelpWithHousing && 'housing' || '',
                    data.HelpWithAccessingInternet && 'technology support' || '',
                    data.HelpWithSomethingElse && 'something else' || ''
                ];

                // Remove empty values.
                data.what_coronavirus_help = what_coronavirus_help.filter(item => item);
            
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
            const updatedCaseNotes = notesHelper.appendNote(userName, query.NewCaseNote, query.CaseNotes);
            const updatedAdviceNotes = notesHelper.appendNote(userName, query.NewAdviceNote, query.AdviceNotes);

            const updatedFields = {
                InitialCallbackCompleted: query.InitialCallbackCompleted == 'yes' && true || false,
                FollowupCallRequired: query.FollowupCallRequired == 'yes' && true || false,
                FirstName: query.FirstName,
                LastName: query.LastName,
                ContactTelephoneNumber: query.ContactTelephoneNumber || '',
                ContactMobileNumber: query.ContactMobileNumber || '',
                EmailAddress: query.EmailAddress,
                DobDay: query.DobDay,
                DobMonth: query.DobMonth,
                DobYear: query.DobYear,
                GettingInTouchReason: query.GettingInTouchReason || '',
                HelpWithAccessingFood: query.what_coronavirus_help.includes('accessing food') && true || false,
                HelpWithDebtAndMoney: query.what_coronavirus_help.includes('debt and money') && true || false,
                HelpWithHealth: query.what_coronavirus_help.includes('health') && true || false,
                HelpWithMentalHealth: query.what_coronavirus_help.includes('mental health') && true || false,
                HelpWithHousing: query.what_coronavirus_help.includes('housing') && true || false,
                HelpWithAccessingInternet: query.what_coronavirus_help.includes('technology support') && true || false,
                HelpWithSomethingElse: query.what_coronavirus_help.includes('something else') && true || false,
                CurrentSupport: query.CurrentSupport || '',
                CurrentSupportFeedback: query.CurrentSupportFeedback || '',
                GpSurgeryDetails: query.GpSurgeryDetails || "",
                NumberOfChildrenUnder18: query.NumberOfChildrenUnder18 || '',
                ConsentToShare: query.consent_to_share && true || false,
                CaseNotes: updatedCaseNotes,
                AdviceNotes: updatedAdviceNotes
            }

            const updatedData = JSON.stringify(updatedFields);

            await HelpRequestModel.updateHelpRequest(id, updatedData)
            .then ( (result) => {
                data = result.data;
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
    async createHelpRequest(query, userName) {
        try {
            let data = [];

            const id = query.Id;
            const recordCreatedText = "*** CREATED ***";

            let caseNotes = notesHelper.appendNote(userName, recordCreatedText, '');
            caseNotes = notesHelper.appendNote(userName, query.NewCaseNote, caseNotes);

            const adviceNotes = notesHelper.appendNote(userName, query.NewAdviceNote, query.AdviceNotes);

            const updatedFields = {
                InitialCallbackCompleted: query.InitialCallbackCompleted == 'yes' && true || false,
                FollowupCallRequired: query.FollowupCallRequired == 'yes' && true || false,
                FirstName: query.FirstName,
                LastName: query.LastName,
                ContactTelephoneNumber: query.ContactTelephoneNumber || '',
                ContactMobileNumber: query.ContactMobileNumber || '',
                EmailAddress: query.EmailAddress,
                DobDay: query.DobDay,
                DobMonth: query.DobMonth,
                DobYear: query.DobYear,
                GettingInTouchReason: query.GettingInTouchReason || '',
                HelpWithAccessingFood: query.what_coronavirus_help.includes('accessing food') && true || false,
                HelpWithDebtAndMoney: query.what_coronavirus_help.includes('debt and money') && true || false,
                HelpWithHealth: query.what_coronavirus_help.includes('health') && true || false,
                HelpWithMentalHealth: query.what_coronavirus_help.includes('mental health') && true || false,
                HelpWithHousing: query.what_coronavirus_help.includes('housing') && true || false,
                HelpWithAccessingInternet: query.what_coronavirus_help.includes('technology support') && true || false,
                HelpWithSomethingElse: query.what_coronavirus_help.includes('something else') && true || false,
                CurrentSupport: query.CurrentSupport || '',
                CurrentSupportFeedback: query.CurrentSupportFeedback || '',
                GpSurgeryDetails: query.GpSurgeryDetails || "",
                NumberOfChildrenUnder18: query.NumberOfChildrenUnder18 || '',
                ConsentToShare: query.consent_to_share && true || false,
                CaseNotes: caseNotes,
                AdviceNotes: adviceNotes,
                DateTimeRecorded: new Date()
            }

            const updatedData = JSON.stringify(updatedFields);

            await HelpRequestModel.updateHelpRequest(id, updatedData)
            .then ( (result) => {
                data = result.data;
            });

            return data;

        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new HelpRequestsService;