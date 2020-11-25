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
      capitalisedFullName: "Boris 2.0 Johnson",
    };
    cy.GivenAResidentDoesNotExist(resident);
    cy.WhenICreateARecordForTheResident(resident);
    cy.ThenTheyWillAppearInTheCallbackList(resident);
  });

  it("allow you to edit", () => {
    cy.get('a[href*="help-requests"]').click();
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="/help-requests/callbacks"]').click();
    cy.get("[data-testid=view-button]").first().click();
    cy.contains("Has the callback been completed");

    cy.get("#initial_callback_completed-2").click({ force: true });
    // open accordion
    cy.get("#resident-bio-heading")
      .click({
        force: true,
        waitForAnimations: true,
        animationDistanceThreshold: 50,
      })
      .then((el) => {
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
    cy.get("[data-testid=view-button]").first().click();
    cy.contains("Has the callback been completed");

    cy.get("#initial_callback_completed-2").click({ force: true });
    cy.get("#change-address").click();
    cy.get(".lbh-heading-h1").should("contain", "Change address");
  });
});
