describe("view residents to contact", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('a[href*="help-requests"]').click();
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="/help-requests/callbacks"]').click();
  });

 /** 
   * It is missing data setup: it should first create a new record then search by postcode to verify it exists in the callback table.
   * We will come back to this
   * 
  it("can retrieve callbacks", () => {
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
    cy.get(':nth-child(1) > :nth-child(4) > .js-cta-btn').click()
    cy.get(':nth-child(9) > .govuk-form-group > .govuk-fieldset > .govuk-fieldset__legend').then((el) => {
      assert.include(el.text(), "Has the callback being completed");
    });
    cy.get('#initial_callback_completed-2').click()
    // open accordion
    cy.get('#resident-bio-heading').click({ force: true,  "waitForAnimations": true,
    "animationDistanceThreshold": 50 })
    .then(el => {
      assert.include(el.text(), "Resident Bio")
      cy.get("#FirstName").type("Donald")
    });

    cy.scrollTo('#btn-bottom-panel')
    cy.get('.text-align-right > .govuk-button').click({ force: true });
  });
});
