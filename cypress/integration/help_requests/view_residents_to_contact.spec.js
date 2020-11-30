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
    cy.GivenAResidentDoesNotExist(resident);
    cy.WhenICreateARecordForTheResident(resident);
    cy.ThenTheyWillAppearInTheCallbackList(resident);
  });

  it("allow you to edit", () => {
    cy.get('a[href*="help-requests"]').click();
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="/help-requests/callbacks"]').click();
    cy.get("[data-testid=view-button]")
      .first()
      .click();

    cy.get("#CallDetail").click({ force: true });
    cy.get("#CallOutcome").click({ force: true });
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
        cy.get("#NumberOfChildrenUnder18").click({ force: true });
      });
    cy.get("#default-example-heading-2").click({ force: true });
    cy.get("#what_coronavirus_help").click({ force: true });
    cy.get("#default-example-heading-1").click({ force: true });
    cy.get("#CurrentSupport").click({ force: true });
    cy.get("#update-btn").click({ force: true });
  });

  it("allow you to change address", () => {
    cy.get('a[href*="help-requests"]').click();
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="/help-requests/callbacks"]').click();
    cy.get("[data-testid=view-button]")
      .first()
      .click();

    cy.get("#change-address").click();
  });
});
