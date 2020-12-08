"use strict";

const validator = require("express-validator");
const querystring = require("querystring");
const notesHelper = require("../../helpers/notes");
const HelpRequestsService = require("../../services/help-requests/help_requests.service");
const HelpRequestCallService = require("../../services/help-requests/help_request_call.service");

const {
  mapFieldErrors,
  mapDescriptionHtml
} = require("../../helpers/fieldErrors");
const dateHelper = require("../../helpers/date");

const SERVER_ERROR_MSG =
  "Sorry, there is a problem with the service. Try again later";

const SNAPSHOT_URL = process.env.SNAPSHOT_URL;
const TEST_MODE = process.env.TEST_MODE;

/**
 * Common functionality to handle a snapshot creation
 * @param query
 * @param res
 */
const handleSnapshotCreation = (query, userName, res) => {
  const requestModel = {
    inhId: query.id,
    firstName: query.FirstName,
    lastName: query.LastName,
    postcode: query.postcode
  };

  HelpRequestsService.createVulnerabilitySnapshot(requestModel, userName).then(
    result => {
      // temporary solution to overcome cypress issue of testing cross sites
      if (TEST_MODE) {
        return res.redirect(SNAPSHOT_URL);
      }

      if (!result) {
        return next(
          new Error(
            "Could not create Snapshot for resident, but the resident form has been saved"
          )
        );
      }
      return res.redirect(SNAPSHOT_URL + "/snapshots/" + result.id);
    }
  );
};

/**
 * Handle common form errors functionality
 *
 * @param req
 * @param res
 * @param errors
 * @param path
 * @returns {void|*|Response}
 */
const handleFormErrors = (req, res, errors, path) => {
  const extractedErrors = mapFieldErrors(errors);
  const descriptionHtml = mapDescriptionHtml(errors);
  return res.redirect(
    path +
      "?haserrors=true&descriptionHtml=" +
      descriptionHtml +
      "&" +
      querystring.stringify(extractedErrors) +
      "&" +
      querystring.stringify(req.body)
  );
};

/**
 * Handle common update help request functionality.
 */
const handleUpdate = (req, res, query, userName) => {
  try {
    HelpRequestsService.updateHelpRequest(query, userName).then(result => {
      if (result.isError === true) {
        return res.redirect(
          "/help-requests/edit/" +
            query.Id +
            "/?haserrors=true&message=" +
            SERVER_ERROR_MSG +
            "&" +
            querystring.stringify(req.body)
        );
      }
      return res.redirect(
        "/help-requests/edit/" + query.Id + "/?hasupdated=true"
      );
    });
  } catch (err) {
    console.log(err);
  }
};
const handleHelpRequestUpdate = async (query, userName) => {
  try {
    await HelpRequestsService.updateHelpRequest(query, userName).then(
      result => {
        if (result.isError === true) {
          return true;
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};
const handleCallCreation = async (query, userName) => {
  try {
    await HelpRequestCallService.createHelpRequestCall(query, userName).then(result => {
      if (result.isError === true) {
        return true;
      }
    });
  } catch (err) {
    console.log(err);
  }
};
/**
 * Compose notes from snapshot data
 */
const composeNotesFromSnapshot = snapshot => {
  const assets = snapshot.assets.map(x => x.name).join(", ") || "N/A";
  const vulnerabilities =
    snapshot.vulnerabilities.map(x => x.name).join(", ") || "N/A";
  const notes = snapshot.notes || "N/A";
  return `Snapshot: #Assets: ${assets}. #Vulnerabilities  ${vulnerabilities}. #Notes:  ${notes}`;
};
module.exports = {
  /**
   * @description Display the Help Request home page
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {object} Express next object
   * @returns {Promise<*>}
   */
  index_get: async (req, res, next) => {
    res.locals.isAdmin = req.auth.isAdmin;

    return res.render("help-requests/index.njk");
  },

  /**
   * @description Render all hlp requests needing a callback
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {object} Express next object
   * @returns {Promise<*>}
   */
  all_callbacks_get: async (req, res, next) => {
    try {
      let params = {
        master: true
      };

      // Add the view filter params E.g. HelpNeeded = Shielding
      if (req.query.HelpNeeded) {
        params.HelpNeeded = req.query.HelpNeeded;
      }

      await HelpRequestsService.getAllCallbacks(params).then(result => {
        res.render("help-requests/help-requests-callbacks-list.njk", {
          helpRequestsData: result
        });
      });
    } catch (err) {
      return next(new Error(err));
    }
  },

  /**
   * @description Search for help requests by postcode
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {object} Express next object
   * @returns {Promise<*>}
   */
  search_help_requests_post: async (req, res, next) => {
    res.locals.query = req.body;

    const postcode = req.body.postcode;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const id = req.body.id;

    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      handleFormErrors(req, res, errors, "/help-requests/search/");
    } else {
      try {
        let data = [];

        /**
         * @param postcode: string - matching full or partial postcode
         */
        await HelpRequestsService.getAllHelpRequests({
          postcode: postcode,
          FirstName: firstName,
          LastName: lastName
        }).then(result => {
          data = result;

          data.forEach(item => {
            const recDate = new Date(item.DateTimeRecorded);
            item.DateTimeRecorded = recDate.toLocaleDateString();
          });

          return res.render("help-requests/help-requests-list.njk", {
            postcode: postcode,
            id: id,
            helpRequestsData: data
          });
        });
      } catch (err) {
        return next(new Error(err));
      }
    }
  },

  /**
   * @description Render a specific help request
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {object} Express next object
   * @returns {Promise<*>}
   */
  help_request_get: async (req, res, next) => {
    try {
      if (req.query.haserrors) {
        res.locals.query = req.query;

        return res.render("help-requests/help-request-edit.njk");
      } else {
        await HelpRequestsService.getHelpRequest(req.params.id).then(result => {
          res.locals.hasupdated = req.query.hasupdated;
          if (result.CaseNotes && notesHelper.isJSON(result.CaseNotes)) {
            result.jsonCaseNotes = JSON.parse(result.CaseNotes);
          }
          if (result.HelpRequestCalls) {
            result.HelpRequestCalls.forEach(x => {
              x.callOutcomes = x.CallOutcome.replace(
                "callback_complete",
                " Callback complete"
              )
                .replace("refused_to_engage", " Refused to engage")
                .replace("follow_up_requested", " Follow up requested")
                .replace("call_rescheduled", " Call rescheduled")
                .replace("voicemail", " Voicemail left")
                .replace("wrong_number", " Wrong number")
                .replace("no_answer_machine", " No answer machine")
                .replace("close_case", " Close case");
              x.call_date = dateHelper.convertNoteDate(x.CallDateTime);
            });
            result.calls = result.HelpRequestCalls.reverse();
          }
          res.render("help-requests/help-request-edit.njk", {
            query: result,
            hasupdated: req.query.hasupdated
          });
        });
      }
    } catch (err) {
      return next(new Error(err));
    }
  },

  /**
   * @description Render a specific help request complete page
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {object} Express next object
   * @returns {Promise<*>}
   */
  help_request_complete_get: async (req, res, next) => {
    try {
      if (req.query.haserrors) {
        res.locals.query = req.query;
        return res.render("help-requests/help-request-complete.njk");
      } else {
        await HelpRequestsService.getHelpRequest(req.params.id).then(result => {
          res.locals.hasupdated = req.query.hasupdated;

          const requestModel = {
            inhId: result.Id,
            firstName: result.FirstName,
            lastName: result.LastName,
            postcode: result.PostCode
          };

          // find snapshot data
          HelpRequestsService.findVulnerabilitySnapshot(requestModel).then(
            snapshotResult => {
              // populates new notes from snapshot
              if (
                snapshotResult.snapshots &&
                snapshotResult.snapshots.length > 0
              ) {
                console.log(
                  `Snapshot found, for resident ${requestModel.firstName}  ${requestModel.lastName}.`
                );
                result.NewCaseNote = composeNotesFromSnapshot(
                  snapshotResult.snapshots[0]
                );
              }
              res.render("help-requests/help-request-complete.njk", {
                query: result,
                hasupdated: req.query.hasupdated
              });
            }
          );
        });
      }
    } catch (err) {
      return next(new Error(err));
    }
  },

  /**
   * Get the edit address page
   */
  help_request_edit_address_get: async (req, res, next) => {
    try {
      if (req.query.haserrors) {
        res.locals.query = req.query;

        return res.render("help-requests/help-request-edit-address.njk");
      } else {
        await HelpRequestsService.getHelpRequest(req.params.id).then(result => {
          res.locals.hasupdated = req.query.hasupdated;
          res.render("help-requests/help-request-edit-address.njk", {
            query: result,
            hasupdated: req.query.hasupdated
          });
        });
      }
    } catch (err) {
      return next(new Error(err));
    }
  },

  /**
   * @description Render a new help request form
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {object} Express next object
   * @returns {Promise<*>}
   */
  help_request_create_get: async (req, res, next) => {
    res.locals.query = req.query;

    return res.render("help-requests/help-request-create.njk");
  },

  /**
   * @description Create a new help request
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {object} Express next object
   * @returns {Promise<*>}
   */
  help_request_create_post: async (req, res, next) => {
    res.locals.query = req.body;

    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      handleFormErrors(req, res, errors, "/help-requests/create/");
    } else {
      const query = req.body;
      const userName = req.auth.name;
      try {
        await HelpRequestsService.createHelpRequest(query, userName)
          .then(result => {
            if (result.isError === true) {
              return res.redirect(
                "/help-requests/create?haserrors=true&" +
                  querystring.stringify(extractedErrors) +
                  "&" +
                  querystring.stringify(req.body) +
                  "&message=" +
                  SERVER_ERROR_MSG
              );
            }
            console.log(
              "Resident created successfully with ID: ",
              result.data.Id
            );
            query.id = result.data.Id;
          })
          .then(() => handleSnapshotCreation(query, userName, res));
      } catch (err) {
        return next(new Error(err));
      }
    }
  },

  /**
   * @description Update a specific help request
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {object} Express next object
   * @returns {Promise<*>}
   */
  help_request_update_post: async (req, res, next) => {
    res.locals.query = req.body;

    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      handleFormErrors(req, res, errors, "/help-requests/edit/" + req.body.Id);
    } else {
      try {
        const query = req.body;
        const userName = req.auth.name;
        let callCreationError;
        if (query.CallOutcome) {
          callCreationError = await handleCallCreation(query, userName);
        }
        const handleUpdateError = await handleHelpRequestUpdate(
          query,
          userName
        );
        if (callCreationError == true || handleUpdateError == true) {
          return res.redirect(
            "/help-requests/edit/" +
              query.Id +
              "/?haserrors=true&message=" +
              SERVER_ERROR_MSG +
              "&" +
              querystring.stringify(req.body)
          );
        }
        return res.redirect(
          "/help-requests/edit/" + query.Id + "/?hasupdated=true"
        );
      } catch (err) {
        return next(new Error(err));
      }
    }
  },

  /**
   * Submit the request complete form
   *
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  help_request_complete_post: async (req, res, next) => {
    res.locals.query = req.body;

    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      handleFormErrors(
        req,
        res,
        errors,
        "/help-requests/complete/" + req.body.Id
      );
    } else {
      try {
        const query = req.body;
        const userName = req.auth.name;

        // prepare partial update
        await HelpRequestsService.getHelpRequest(req.params.id).then(
          originalRecord => {
            // keep the original record and update only case notes and callback
            let updateRequest = originalRecord;
            updateRequest.NewCaseNote = query.NewCaseNote;
            updateRequest.callback_required = query.callback_required;
            updateRequest.initial_callback_completed = "yes";
            handleUpdate(req, res, updateRequest, userName);
          }
        );
      } catch (err) {
        return next(new Error(err));
      }
    }
  },

  /**
   * Submit the change of address form
   *
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  help_request_edit_address_post: async (req, res, next) => {
    res.locals.query = req.body;

    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      handleFormErrors(
        req,
        res,
        errors,
        "/help-requests/address/" + req.body.Id
      );
    } else {
      try {
        const query = req.body;
        const userName = req.auth.name;

        // prepare partial update
        await HelpRequestsService.getHelpRequest(req.params.id).then(
          originalRecord => {
            // keep the original record and update only address fields
            let updateRequest = originalRecord;
            updateRequest.address_first_line = query.address_first_line;
            updateRequest.address_second_line = query.address_second_line;
            updateRequest.address_third_line = query.address_third_line;
            updateRequest.postcode = query.postcode;
            updateRequest.building_number = query.building_number;
            updateRequest.uprn = query.uprn;
            updateRequest.ward = query.ward;
            updateRequest.gazetteer = query.gazetteer;

            HelpRequestsService.patchHelpRequestAddress(query, userName).then(
              result => {
                if (result.isError === true) {
                  return res.redirect(
                    "/help-requests/address/" +
                      query.Id +
                      "/?haserrors=true&message=" +
                      SERVER_ERROR_MSG +
                      "&" +
                      querystring.stringify(req.body)
                  );
                }
                return res.redirect(
                  "/help-requests/edit/" + query.Id + "/?hasupdated=true"
                );
              }
            );
          }
        );
      } catch (err) {
        return next(new Error(err));
      }
    }
  },

  /**
   * @description Requests to edits a vulnerability snapshot for a resident
   *
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {object} Express next object
   * @returns {Promise<*>}
   */
  help_request_edit_snapshot: async (req, res, next) => {
    res.locals.query = req.body;
    res.locals.isAdmin = req.auth.isAdmin;

    try {
      const query = req.body;
      const userName = req.auth.name;

      const requestModel = {
        inhId: query.id,
        firstName: query.FirstName,
        lastName: query.LastName,
        postcode: query.postcode
      };
      await HelpRequestsService.findVulnerabilitySnapshot(requestModel).then(
        result => {
          if (result.snapshots && result.snapshots.length > 0) {
            console.log(
              `Snapshot found, for resident ${query.firstName}  ${query.lastName}. Opening...`
            );
            return res.redirect(
              SNAPSHOT_URL + "/snapshots/" + result.snapshots[0].id
            );
          } else {
            console.log(
              `Snapshot not found, for resident ${query.firstName}  ${query.lastName}. Creating...`
            );
            handleSnapshotCreation(query, userName, res);
          }
        }
      );
    } catch (err) {
      return next(new Error(err));
    }
  }
};
