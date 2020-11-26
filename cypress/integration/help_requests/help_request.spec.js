describe("help requests", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("can create a new help request record", () => {
    let resident = {
      firstName: "Boris",
      lastName: "Johnson",
      postcode: "E8 1DY",
      address: "Somewhere, over the rainbow, E8 1DY",
      contactNumber: "999",
      birthDay: "01",
      brithMonth: "01",
      birthYear: "1975",
      capitalisedFullName: "Boris Johnson"
    };
    cy.GivenAResidentDoesNotExist(resident);
    cy.WhenICreateARecordForTheResident(resident);
    cy.ThenTheyWillAppearInTheCallbackList(resident);
  });
  it("can edit an existing resident record", () => {
    let resident = {
      firstName: "David",
      lastName: "Beckham",
      postcode: "E8 2DY",
      address: "Edge, of glory, E8 2DY",
      contactNumber: "999",
      birthDay: "01",
      brithMonth: "01",
      birthYear: "1975",
      capitalisedFullName: "David Beckham"
    };
    let newName = "Victoria";
    GivenAResidentExists(resident);
    WhenIEditTheResidentRecord(newName);
  });
  it("can remove a help request from a call back list", () => {
    let resident = {
      firstName: "John",
      lastName: "Beckham",
      postcode: "E8 2AB",
      address: "moment of truth,  HACKNEY,  LONDON, E8 2AB",
      contactNumber: "999",
      birthDay: "01",
      brithMonth: "01",
      birthYear: "1975",
      capitalisedFullName: "John Beckham"
    };
    GivenAResidentExists(resident);
    WhenICompleteACallbackRequest(resident);
    ThenItWillBeRemovedFromTheCallbackList(resident);
  });

  function GivenAResidentExists(resident) {
    cy.WhenICreateARecordForTheResident(resident);
    cy.visit("/");
    cy.get("table > tbody > tr > td > a")
      .first()
      .click({});
    cy.url().should("include", "/help-requests");
    cy.get("table > tbody > tr > td > a")
      .first()
      .click();
    cy.url().should("include", "/help-requests/search");
    cy.get(".lbh-heading-h1").should("contain", "Resident lookup");
    cy.get("#postcode").type(resident.postcode);
    cy.get("form > button").click();
    cy.get("table").should("contain", resident.capitalisedFullName);
  }
  function WhenIEditTheResidentRecord(newName) {
    cy.get("[data-testid=view-button]")
      .first()
      .click();
    cy.get("#resident-bio-heading").click({ force: true });
    cy.get("#FirstName").clear({ force: true });
    cy.get("#FirstName").type(newName, { force: true });
    cy.get("#NumberOfChildrenUnder18").click({ force: true });
    cy.get("#default-example-heading-2").click({ force: true });
    cy.get("#what_coronavirus_help").click({ force: true });
    cy.get("#default-example-heading-1").click({ force: true });
    cy.get("#CurrentSupport").click({ force: true });
    cy.get("button")
      .contains("Update")
      .click({ force: true });
  }
  function ThenTheyWillBeUpdated() {
    expect(cy.contains("Updated succesfully"));
  }

  function WhenICompleteACallbackRequest(resident) {
    cy.get("table > tbody > tr > td > a")
      .first()
      .click({});
    cy.get("#NumberOfChildrenUnder18").check("0", { force: true });
    cy.get(".govuk-accordion__open-all").click({ force: true });
    cy.get("#CurrentSupport > .govuk-checkboxes__item > input")
      .first()
      .check({ force: true });
    cy.get("#what_coronavirus_help > .govuk-checkboxes__item > input")
      .first()
      .check({ force: true });
    cy.get("button")
      .contains("Update")
      .click({ force: true });
  }
  function ThenItWillBeRemovedFromTheCallbackList(resident) {
    cy.get(".lbh-header__title-link").click();
    cy.get("table > tbody > tr > td > a")
      .first()
      .click({});
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="help-requests/callbacks"]').click();
  }
});
