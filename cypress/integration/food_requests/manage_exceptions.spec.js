describe("manage exceptions", () => {
  let postcode;
  beforeEach(() => {
    cy.visit("/");
    cy.get('a[href*="food-requests"]').click();
    cy.url().should("include", "/food-requests");
  });
  xit("can view all exceptions", () => {
    cy.get('a[href*="food-requests/exceptions"]').click();
    cy.get("thead > tr > th").then(el => {
      assert.include(el.text(), "UPRN");
    });
    cy.get("tbody > tr > td").then(el => {
      assert.include(el.text(), "100021021672");
    });
  });
  xit("can edit exceptions", () => {
    cy.get('a[href*="food-requests/exceptions"]').click();
    cy.get(":nth-child(1) > :nth-child(4) > .js-cta-btn")
      .click()
      .then(el => {
        cy.get(".govuk-button").contains("Update all records");
      });
  });
});
