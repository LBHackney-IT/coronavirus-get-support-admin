describe("view residents to contact", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("can create a new help request record", () => {
    let resident = {
      firstName: "Boris",
      lastName: "Johnson",
      postcode: "E8 1DY",
      address: "THE HACKNEY SERVICE CENTRE, 1 HILLMAN STREET, E8 1DY",
      contactNumber: "999",
      birthDay: "01",
      brithMonth: "01",
      birthYear: "1975",
      capitalisedFullName: "BORIS JOHNSON",
    };
    GivenAResidentDoesNotExist(resident);
    WhenICreateARecordForTheResident(resident);
    ThenTheyWillAppearInTheCallbackList(resident);
  });
  it("can edit an existing resident record", () => {
    let resident = {
      firstName: "David",
      lastName: "Beckham",
      postcode: "E9 1DY",
      address: "THE HACKNEY SERVICE CENTRE, 1 HILLMAN STREET, E8 1DY",
      contactNumber: "999",
      birthDay: "01",
      brithMonth: "01",
      birthYear: "1975",
      capitalisedFullName: "DAVID BECKHAM",
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
      postcode: "E1 6PB",
      address: "BISHOPSGATE GOODS YARD, 40 SHOREDITCH HIGH STREET, E1 6PA",
      contactNumber: "999",
      birthDay: "01",
      brithMonth: "01",
      birthYear: "1975",
      capitalisedFullName: "JOHN BECKHAM",
    };
    GivenAResidentExists(resident);
    WhenICompleteACallbackRequest(resident);
    ThenItWillBeRemovedFromTheCallbackList(resident);
  });

  function GivenAResidentDoesNotExist(resident) {
    cy.get("table > tbody > tr > td > a").first().click({});
    cy.url().should("include", "/help-requests");
    cy.get("table > tbody > tr > td > a").first().click();
    cy.url().should("include", "/help-requests/search");
    cy.get("input").type(resident.postcode);
    cy.get(".lbh-heading-h1").should("contain", "Resident lookup");
    cy.get("form > button").click();
    cy.get("table").should("not.contain", resident.capitalisedFullName);
  }

  function WhenICreateARecordForTheResident(resident) {
    cy.get('a[href*="/help-requests/create"]').click();
    cy.get("#FirstName").type(resident.firstName);
    cy.get("#LastName").type(resident.lastName);
    cy.get("#ContactTelephoneNumber").type(resident.contactNumber);
    cy.get("#DobDay").type(resident.birthDay);
    cy.get("#DobMonth").type(resident.brithMonth);
    cy.get("#DobYear").type(resident.birthYear);
    cy.get("#lookup_postcode").type(resident.postcode);
    cy.get("#address-finder").click();
    cy.get("#address-div").should("contain", "Select address");
    cy.get("#address-select").select(resident.address);
    cy.get('[type="checkbox"]').check("accessing food");
    cy.get('[type="checkbox"]').check("family");
    cy.get('[type="radio"]').check("0");
    cy.get('[type="radio"]').check("yes");
    cy.get('[type="radio"]').check("yes");
    cy.get('[type="radio"]').check("yes");
    cy.get("button").contains("Save").click();
    expect(
      cy.get(".govuk-panel__body").should("contain", "Creation successful")
    );
  }
  function ThenTheyWillAppearInTheCallbackList(resident) {
    cy.get(".lbh-header__title-link").click();
    cy.get("table > tbody > tr > td > a").first().click({});
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="help-requests/callbacks"]').click();
    expect(cy.contains(`${resident.capitalisedFullName}`));
  }
  function GivenAResidentExists(resident) {
    cy.get("table > tbody > tr > td > a").first().click({});
    cy.url().should("include", "/help-requests");
    cy.get("table > tbody > tr > td > a").first().click();
    cy.url().should("include", "/help-requests/search");
    cy.get(".lbh-heading-h1").should("contain", "Resident lookup");
    cy.get("input").type(resident.postcode);
    cy.get("form > button").click();
    cy.get("table").should("contain", resident.capitalisedFullName);
  }
  function WhenIEditTheResidentRecord(newName) {
    cy.get("td > a").click();
    cy.url().should("include", "help-requests/edit/47");
    cy.get("#resident-bio-heading").click();
    cy.get("#FirstName").clear();
    cy.get("#FirstName").type(newName);
    cy.get("button").contains("Update").click();
  }
  function ThenTheyWillBeUpdated() {
    expect(cy.contains("Updated succesfully"));
  }

  function WhenICompleteACallbackRequest(resident) {
    cy.get('a[href*="help-requests/edit/47"]').click();
    cy.get("#initial_callback_completed").check("yes");
    cy.get("#callback_required-2").check("no");
    cy.get("button").contains("Update").click();
  }
  function ThenItWillBeRemovedFromTheCallbackList(resident) {
    cy.get(".lbh-header__title-link").click();
    cy.get("table > tbody > tr > td > a").first().click({});
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="help-requests/callbacks"]').click();
    cy.get("table").should("not.contain", resident.capitalisedFullName);
  }
});
