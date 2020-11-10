describe("view residents to contact", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  //agent first searches to see if the resident already exists
  it("can search and create a new resident record", () => {
    let resident = {
      firstName: "Boris 2.0",
      lastName: "Johnson",
      postcode: "E8 1DY",
      address: "Somewhere, over the rainbow, E8 1DY",
      contactNumber: "999",
      birthDay: "01",
      brithMonth: "01",
      birthYear: "1975",
      capitalisedFullName: "Boris 2.0 Johnson"
    };
    GivenAResidentDoesNotExist(resident);
    WhenICreateARecordForTheResident(resident);
    ThenTheyWillAppearInTheCallbackList(resident);
  });
  it("can edit an existing resident record", () => {});
  //when they dont find an entry for the resident, the agent will create an entry for them
  //how do they navigate to that page form the page above, test are disconnected
  // it("can create a new record for the resident", () => {});

  /** 
   * It is missing data setup: it should first create a new record then search by postcode to verify it exists in the callback table.
   * We will come back to this
   * 
  it("can retrieve callbacks", () => {
      cy.get('a[href*="help-requests"]').click();
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="/help-requests/callbacks"]').click();
    cy.get("h1").then((el) => {
      assert.include(el.text(), "Callback list");
    });
    cy.get("div > table > tbody > tr > td").then((el) => {
      assert.include(el.text(), "RONALD REAGAN");
      assert.include(el.text(), "DOLLY PARTON");
    });
  });
  */

  it("allow you to edit", () => {
    cy.get('a[href*="help-requests"]').click();
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="/help-requests/callbacks"]').click();
    cy.get("[data-testid=view-button]")
      .first()
      .click();
    cy.get(".govuk-fieldset__legend")
      .first()
      .should("contain", "Has the callback been completed");

    cy.get("#initial_callback_completed-2").click({ force: true });
    // open accordion
    cy.get("#resident-bio-heading")
      .click({
        force: true,
        waitForAnimations: true,
        animationDistanceThreshold: 50
      })
      .then(el => {
        assert.include(el.text(), "Resident Bio");
        cy.get("#FirstName").type("Donald", { force: true });
      });

    cy.get("#update-btn").click({ force: true });
    cy.get(".govuk-panel__title").should("contain", "Updated succesfully");
  });

  it("allow you to change address", () => {
    cy.get('a[href*="help-requests"]').click();
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="/help-requests/callbacks"]').click();
    cy.get("[data-testid=view-button]")
      .first()
      .click();
    cy.get(".govuk-fieldset__legend")
      .first()
      .should("contain", "Has the callback been completed");

    cy.get("#initial_callback_completed-2").click({ force: true });
    cy.get("#change-address").click();
    cy.get(".lbh-heading-h1").should("contain", "Change address");
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
    cy.get('a[href*="/help-requests/create"]').click();
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
});
