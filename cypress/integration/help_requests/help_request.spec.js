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
    GivenAResidentDoesNotExist(resident);
    WhenICreateARecordForTheResident(resident);
    ThenTheyWillAppearInTheCallbackList(resident);
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
    ThenTheyWillBeUpdated();
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

  function GivenAResidentDoesNotExist(resident) {
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
  }

  function WhenICreateARecordForTheResident(resident) {
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
    cy.get("#HelpNeeded").check("Help Request", { force: true });
    cy.get("button")
      .contains("Next")
      .click({ force: true });
    // this does not really go to dashboard but we have an issue with Cypres being unable to test cross origins
    expect(cy.get("h1").should("contain", "Manage support for resident"));
  }
  function ThenTheyWillAppearInTheCallbackList(resident) {
    cy.get(".lbh-header__title-link").click();
    cy.get("table > tbody > tr > td > a")
      .first()
      .click({});
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="help-requests/callbacks"]').click();
    expect(cy.contains(`${resident.capitalisedFullName}`));
  }
  function GivenAResidentExists(resident) {
    WhenICreateARecordForTheResident(resident);
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
    cy.get("#initial_callback_completed").check("yes", { force: true });
    cy.get("#callback_required-2").check("no");
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
    cy.get("table").should("not.contain", resident.capitalisedFullName);
  }
});
