const { check } = require('express-validator');

const config = require('../config');

const addressValidation = [
  check("lookup_postcode", "Enter a postcode")
    .trim().escape().notEmpty(),
  check("lookup_postcode", "Enter a valid postcode")
    .if(check("lookup_postcode").notEmpty()).isPostalCode("GB")
]

const helpRequestValidation = [
  check("OngoingFoodNeed", "Choose an option")
    .trim().escape().notEmpty(),
  check("NumberOfPeopleInHouse", "Enter the number of people in the house")
    .trim().escape().toInt().notEmpty().isLength({min: 1, max: undefined}),
  check("last_confirmed_food_delivery_day", "Enter a day")
    .trim().escape().toInt().notEmpty().isLength({min: 1, max: 2}),
  check("last_confirmed_food_delivery_month", "Enter a month")
    .trim().escape().toInt().notEmpty().isLength({min: 1, max: 2}),
  check("last_confirmed_food_delivery_year", "Enter a year")
    .trim().escape().toInt().notEmpty().isLength({min: 4, max: 4})
]

module.exports = {
  addressValidation,
  helpRequestValidation
}