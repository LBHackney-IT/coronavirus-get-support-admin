const { check } = require('express-validator');

const config = require('../config');

const addressValidation = [
  check("postcode", "Enter a postcode")
    .trim().escape().notEmpty(),
  check("postcode", "Enter a valid postcode")
    .if(check("postcode").notEmpty()).isPostalCode("GB")
]

const helpRequestValidation = [
  check("OngoingFoodNeed", "Choose an option")
    .trim().escape().notEmpty(),
  check("NumberOfPeopleInHouse", "Enter the number of people in the house")
    .trim().escape().notEmpty(),
  check("last_confirmed_food_delivery_day", "Enter a day")
    .trim().escape().isInt({min: 1, max: 31}),
  check("last_confirmed_food_delivery_month", "Enter a month")
    .trim().escape().isInt({min: 1, max: 12}),
  check("last_confirmed_food_delivery_year", "Enter a year")
    .trim().escape().isLength({min: 4, max: 4}).isInt()
]

module.exports = {
  addressValidation,
  helpRequestValidation
}