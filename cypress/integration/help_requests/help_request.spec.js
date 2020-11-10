describe("view residents to contact", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("can create a new help request record", () => {
    let resident = {
      firstName: "Boris",
      lastName: "Johnson",
      postcode: "E8 1DY",
      address: "HACKNEY SERVICE CENTRE, 1 HILLMAN STREET, E8 1DY",
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
      address: "FLAT 100, HINDLE HOUSE, E8 2DY",
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
      postcode: "E1 6PA",
      address: "BISHOPSGATE GOODS YARD, 40 SHOREDITCH HIGH STREET, E1 6PA",
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
    cy.get("#lookup_postcode").type(resident.postcode);
    cy.get("#address-finder").click({ force: true });
    cy.get("#address-div").should("contain", "Select address");
    cy.get("#address-select").select("0");
    cy.get("#consent_to_share").check("yes");
    cy.get("#HelpNeeded").check("Help Request");
    cy.get("button")
      .contains("Next")
      .click();
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
    cy.get("td > a").click();
    cy.get("#resident-bio-heading").click();
    cy.get("#FirstName").clear();
    cy.get("#FirstName").type(newName);
    cy.get("button")
      .contains("Update")
      .click();
  }
  function ThenTheyWillBeUpdated() {
    expect(cy.contains("Updated succesfully"));
  }

  function WhenICompleteACallbackRequest(resident) {
    cy.get("table > tbody > tr > td > a")
      .first()
      .click({});
    cy.get("#initial_callback_completed").check("yes");
    cy.get("#callback_required-2").check("no");
    cy.get("button")
      .contains("Update")
      .click();
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
