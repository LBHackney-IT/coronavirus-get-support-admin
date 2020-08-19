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
      address: "THE HACKNEY SERVICE CENTRE, 1 HILLMAN STREET, E8 1DY",
      contactNumber: "999",
      birthDay: "01",
      brithMonth: "01",
      birthYear: "1975",
      capitalisedFullName: "BORRIS 2.0 JOHNNSON",
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

  // it("allow you to edit", () => {
  //   cy.get('a[href*="help-requests"]').click();
  //   cy.url().should("include", "/help-requests");
  //   cy.get('a[href*="/help-requests/callbacks"]').click();
  //   cy.get(":nth-child(1) > :nth-child(4) > .js-cta-btn").click();
  //   cy.get(
  //     ":nth-child(9) > .govuk-form-group > .govuk-fieldset > .govuk-fieldset__legend"
  //   ).then((el) => {
  //     assert.include(el.text(), "Has the callback being completed");
  //   });
  //   cy.get("#initial_callback_completed-2").click();
  //   // open accordion
  //   cy.get("#resident-bio-heading")
  //     .click({
  //       force: true,
  //       waitForAnimations: true,
  //       animationDistanceThreshold: 50,
  //     })
  //     .then((el) => {
  //       assert.include(el.text(), "Resident Bio");
  //       cy.get("#FirstName").type("Donald");
  //     });

  //   cy.scrollTo("#btn-bottom-panel");
  //   cy.get(".govuk-button").click({ force: true });
  // });

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
});
