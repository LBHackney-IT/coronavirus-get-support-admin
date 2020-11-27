// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const addResident = resident => {
  cy.visit("/help-requests/create");
  cy.get("#FirstName").type(resident.firstName);
  cy.get("#LastName").type(resident.lastName);
  cy.get("#ContactTelephoneNumber").type(resident.contactNumber);
  cy.get("#DobDay").type(resident.birthDay, { force: true });
  cy.get("#DobMonth").type(resident.brithMonth, { force: true });
  cy.get("#DobYear").type(resident.birthYear, { force: true });
  cy.get("#lookup_postcode").type(resident.postcode, { force: true });
  cy.get("#address-finder").click({ force: true });
  cy.get("#address-div").should("contain", "Select address");
  cy.get("#address-select").select("0", { force: true });
  cy.get("#consent_to_share").check("yes", { force: true });
  cy.get("#HelpNeeded-2").check("Help Request", { force: true });
  cy.get("button")
    .contains("Next")
    .click({ force: true });
  // this does not really go to dashboard but we have an issue with Cypres being unable to test cross origins
  expect(cy.get("h1").should("contain", "Manage support for resident"));
};

const GivenAResidentDoesNotExist = resident => {
  cy.get("table > tbody > tr > td > a")
    .first()
    .click({});
  cy.url().should("include", "/help-requests");
  cy.get("table > tbody > tr > td > a")
    .first()
    .click();
  cy.url().should("include", "/help-requests/search");
  cy.get("#postcode").type(resident.postcode);
  cy.get(".lbh-heading-h1").should("contain", "Resident lookup");
  cy.get("form > button").click();
  cy.get("table").should("not.contain", resident.capitalisedFullName);
};

const ThenTheyWillAppearInTheCallbackList = resident => {
  cy.get(".lbh-header__title-link").click();
  cy.get("table > tbody > tr > td > a")
    .first()
    .click({});
  cy.url().should("include", "/help-requests");
  cy.get('a[href*="help-requests/callbacks"]').click();
  expect(cy.contains(`${resident.capitalisedFullName}`));
};

Cypress.Commands.add("WhenICreateARecordForTheResident", addResident);
Cypress.Commands.add("GivenAResidentDoesNotExist", GivenAResidentDoesNotExist);
Cypress.Commands.add(
  "ThenTheyWillAppearInTheCallbackList",
  ThenTheyWillAppearInTheCallbackList
);
