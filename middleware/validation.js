const { check } = require('express-validator');

const searchValidation = [
  check("postcode", "Enter a postcode")
    .if(
      check("searchby").contains('postcode'))
    .trim().escape().notEmpty(),
  check("postcode", "Enter a valid postcode")
    .if(
      check("searchby").contains('postcode'))
    .notEmpty().isPostalCode("GB"),
  check("id", "Enter a valid Annex ID")
    .if(
      check("searchby").contains('id'))
    .notEmpty().isInt()
]

const addressValidation = [
  check("postcode", "Enter a postcode")
    .trim().escape().notEmpty(),
  check("postcode", "Enter a valid postcode")
    .if(check("postcode").notEmpty()).isPostalCode("GB")
]

const foodRequestValidation = [
  check("OngoingFoodNeed", "Choose an option")
    .trim().escape().notEmpty(),
  check("last_confirmed_food_delivery_day", "Enter a day")
    .trim().escape().isInt({min: 1, max: 31}),
  check("last_confirmed_food_delivery_month", "Enter a month")
    .trim().escape().isInt({min: 1, max: 12}),
  check("last_confirmed_food_delivery_year", "Enter a year")
    .trim().escape().isLength({min: 4, max: 4}).isInt(),
  check("FirstName", "Enter the first name")
    .if(check("FirstName").exists()).trim().escape().notEmpty(),
  check("LastName", "Enter the last name")
    .if(check("LastName").exists()).trim().escape().notEmpty(),
  check("AddressFirstLine", "Enter the first line of the address")
    .if(check("AddressFirstLine").exists()).trim().escape().notEmpty(),
  check("Postcode", "Enter the postode")
    .if(check("Postcode").exists()).trim().escape().notEmpty(),
  check("Uprn", "Enter the UPRN")
    .if(check("Uprn").exists()).trim().escape().notEmpty()
]

const deliveryLimitValidation = [
  check("delivery_limit", "Enter a delivery limit greater than 0")
    .trim().escape().notEmpty().isInt({min: 1})
]

const helpRequestCreateValidation = [
  check("InitialCallbackCompleted", "Select if the initial callback has been completed.")
    .notEmpty(),
  check("CallbackRequired", "Select if a follow up callback is required.")
    .notEmpty(),
  check("what_coronavirus_help", "Select what you need help with.")
    .notEmpty(),
  check("CurrentSupport", "Select who is helping you at the moment.")
    .notEmpty(),
  check("FirstName", "Enter your first name.")
      .notEmpty(),
  check("LastName", "Enter your last name.")
    .notEmpty(),
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
  check("DobDay", "Enter a day of birth")
    .trim()
    .escape()
    .notEmpty(),
  check("DobMonth", "Enter a month of birth")
    .trim()
    .escape()
    .notEmpty(),
  check("DobYear", "Enter a year of birth")
    .trim()
    .escape()
    .notEmpty(),
  check("ContactTelephoneNumber", "Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192.")
    .trim()
    .escape()
    .notEmpty(),
  check("NumberOfChildrenUnder18", "Select the number of children under 18 in your household.")
    .trim()
    .escape()
    .notEmpty(),
  check("consent_to_share", "Select yes if we can share the information in this form with organisations offering help.")
    .trim()
    .escape()
    .notEmpty() 
]

const helpRequestEditValidation = [
  check("what_coronavirus_help", "Select what you need help with.")
    .notEmpty(),
  check("CurrentSupport", "Select who is helping you at the moment.")
    .notEmpty(),
  check("FirstName", "Enter your first name.")
      .notEmpty(),
  check("LastName", "Enter your last name.")
    .notEmpty(),
  check("DobDay", "Enter a day of birth")
    .trim()
    .escape()
    .notEmpty(),
  check("DobMonth", "Enter a month of birth")
    .trim()
    .escape()
    .notEmpty(),
  check("DobYear", "Enter a year of birth")
    .trim()
    .escape()
    .notEmpty(),
  check("ContactTelephoneNumber", "Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192.")
    .trim()
    .escape()
    .notEmpty(),
  check("NumberOfChildrenUnder18", "Select the number of children under 18 in your household.")
    .trim()
    .escape()
    .notEmpty(),
  check("consent_to_share", "Select yes if we can share the information in this form with organisations offering help.")
    .trim()
    .escape()
    .notEmpty() 
]


const helpRequestCompleteValidation = [
  check("callback_required", "Select yes if a follow up call is required.")
      .trim()
      .escape()
      .notEmpty()
]

module.exports = {
  searchValidation,
  addressValidation,
  foodRequestValidation,
  deliveryLimitValidation,
  helpRequestCreateValidation,
  helpRequestEditValidation,
  helpRequestCompleteValidation
}