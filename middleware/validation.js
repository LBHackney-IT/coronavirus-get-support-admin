const { check, oneOf } = require("express-validator");

const searchValidation = [
  check("postcode", "Enter a postcode")
    .if(check("searchby").contains("postcode"))
    .trim()
    .escape()
    .notEmpty(),
  check("postcode", "Enter a valid postcode")
    .if(check("searchby").contains("postcode"))
    .notEmpty()
    .isPostalCode("GB"),
  check("id", "Enter a valid Annex ID")
    .if(check("searchby").contains("id"))
    .notEmpty()
    .isInt(),
];

const searchResidentValidation = [
  oneOf(
    [
      check("firstName").notEmpty(),
      check("lastName").notEmpty(),
      check("postcode").notEmpty(),
    ],
    "Enter at least one name or a postcode"
  ),
];

const addressValidation = [
  check(
    "lookup_postcode",
    "Select a new address to update the current address"
  ).notEmpty(),
  check("address_first_line", "Enter the first line of the address")
    .if(check("lookup_postcode").exists())
    .trim()
    .escape()
    .notEmpty(),
  check("postcode", "Enter the postode")
    .if(check("lookup_postcode").exists())
    .trim()
    .escape()
    .notEmpty(),
  check("uprn", "Enter the UPRN")
    .if(check("lookup_postcode").exists())
    .trim()
    .escape()
    .notEmpty(),
];

const foodRequestValidation = [
  check("OngoingFoodNeed", "Choose an option").trim().escape().notEmpty(),
  check("last_confirmed_food_delivery_day", "Enter a day")
    .trim()
    .escape()
    .isInt({ min: 1, max: 31 }),
  check("last_confirmed_food_delivery_month", "Enter a month")
    .trim()
    .escape()
    .isInt({ min: 1, max: 12 }),
  check("last_confirmed_food_delivery_year", "Enter a year")
    .trim()
    .escape()
    .isLength({ min: 4, max: 4 })
    .isInt(),
  check("FirstName", "Enter the first name")
    .if(check("FirstName").exists())
    .trim()
    .escape()
    .notEmpty(),
  check("LastName", "Enter the last name")
    .if(check("LastName").exists())
    .trim()
    .escape()
    .notEmpty(),
  check("AddressFirstLine", "Enter the first line of the address")
    .if(check("AddressFirstLine").exists())
    .trim()
    .escape()
    .notEmpty(),
  check("Postcode", "Enter the postode")
    .if(check("Postcode").exists())
    .trim()
    .escape()
    .notEmpty(),
  check("Uprn", "Enter the UPRN")
    .if(check("Uprn").exists())
    .trim()
    .escape()
    .notEmpty(),
];

const deliveryLimitValidation = [
  check("delivery_limit", "Enter a delivery limit greater than 0")
    .trim()
    .escape()
    .notEmpty()
    .isInt({ min: 1 }),
];

const helpRequestCreateValidation = [
  check("FirstName", "Enter your first name.").notEmpty(),
  check("LastName", "Enter your last name.").notEmpty(),
  check("address_first_line", "Enter the first line of the address")
    .trim()
    .escape()
    .notEmpty(),
  check("postcode", "Enter a real postcode, like E8 1EA.")
    .trim()
    .escape()
    .notEmpty(),
  check("postcode", "Enter a real postcode, like E8 1EA.")
    .if(check("postcode").notEmpty())
    .isPostalCode("GB"),
  check("DobDay", "Enter a day of birth").trim().escape().notEmpty(),
  check("DobMonth", "Enter a month of birth").trim().escape().notEmpty(),
  check("DobYear", "Enter a year of birth").trim().escape().notEmpty(),
  check(
    "ContactTelephoneNumber",
    "Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192."
  )
    .trim()
    .escape()
    .notEmpty(),
  check(
    "consent_to_share",
    "Select yes if we can share the information in this form with organisations offering help."
  )
    .trim()
    .escape()
    .notEmpty(),
  check("HelpNeeded", "Select what type of help is needed")
    .trim()
    .escape()
    .notEmpty(),
];

const helpRequestEditValidation = [
  check("HelpNeeded", "Select what type of help is needed")
    .trim()
    .escape()
    .notEmpty(),
  oneOf(
    [
      [
        check("what_coronavirus_help").notEmpty(),
        check("CurrentSupport").notEmpty(),
        check("NumberOfChildrenUnder18").trim().escape().notEmpty(),
        check("HelpNeeded").custom(
          (value) =>
            value === "Help Needed" ||
            value === "Welfare Call" ||
            value === "Shielding"
        ),
      ],
      [
        check("CallOutcome").custom(
          (value) =>
            value.includes("voicemail") ||
            value.includes("no_answer_machine") ||
            value.includes("wrong_number")
        ),
        check("CallType", "specify the type of help the call was regarding")
          .trim()
          .escape()
          .notEmpty(),
        check("CallDirection", "specify who initiated the call")
          .trim()
          .escape()
          .notEmpty(),
      ],
      [
        check("CallOutcome").custom(
          (value) =>
            value === "refused_to_engage" ||
            value === "call_rescheduled" ||
            value === "voicemail" ||
            value === "no_answer_machine" ||
            value === "wrong_number"
        ),
        check("CallType", "specify the type of help the call was regarding")
          .trim()
          .escape()
          .notEmpty(),
        check("CallDirection", "specify who initiated the call")
          .trim()
          .escape()
          .notEmpty(),
      ],
      [
        check("CallOutcome").custom(
          (value) =>
            value === "callback_complete" ||
            value === "refused_to_engage" ||
            value === "follow_up_requested" ||
            value === "call_rescheduled"
        ),
        check("CallType", "specify the type of help the call was regarding")
          .trim()
          .escape()
          .notEmpty(),
        check("CallDirection", "specify who initiated the call")
          .trim()
          .escape()
          .notEmpty(),
      ],
      [
        check("CallOutcome").custom(
          (value) =>
            value.includes("callback_complete") ||
            value.includes("follow_up_requested")
        ),
        check("CallType", "specify the type of help the call was regarding")
          .trim()
          .escape()
          .notEmpty(),
        check("CallDirection", "specify who initiated the call")
          .trim()
          .escape()
          .notEmpty(),
      ],
    ],
    "Select what you need help with, who is helping you at the moment and the number of children under 18 in your household. If you have logged a call, make sure you have completed all the neccessary fields"
  ),
  check("FirstName", "Enter your first name.").notEmpty(),
  check("LastName", "Enter your last name.").notEmpty(),
  check("DobDay", "Enter a day of birth").trim().escape().notEmpty(),
  check("DobMonth", "Enter a month of birth").trim().escape().notEmpty(),
  check("DobYear", "Enter a year of birth").trim().escape().notEmpty(),
  check(
    "ContactTelephoneNumber",
    "Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192."
  )
    .trim()
    .escape()
    .notEmpty(),
  check(
    "consent_to_share",
    "Select yes if we can share the information in this form with organisations offering help."
  )
    .trim()
    .escape()
    .notEmpty(),
];

module.exports = {
  searchValidation,
  searchResidentValidation,
  addressValidation,
  foodRequestValidation,
  deliveryLimitValidation,
  helpRequestCreateValidation,
  helpRequestEditValidation,
};
