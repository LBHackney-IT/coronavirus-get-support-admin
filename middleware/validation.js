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

const helpRequestValidation = [
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

module.exports = {
  searchValidation,
  addressValidation,
  helpRequestValidation,
  deliveryLimitValidation
}