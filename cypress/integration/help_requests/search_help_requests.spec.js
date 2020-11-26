describe("search help requests", () => {
  let postcode;
  beforeEach(() => {
    cy.visit("/");
    cy.get('a[href*="help-requests"]').click();
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="/help-requests/search"]').click();
  });

  it("does not error when there are no requests from a valid postcode", () => {
    postcode = "E4";
    cy.get("#postcode").type(postcode);
    cy.get("button").click();
    cy.get("h3").then((el) => {
      assert.include(el.text(), `No records found`);
    });
  });

  it("requires either name or a postcode to proceed to search", () => {
    postcode = " ";
    cy.get("button").click();
    cy.get(".govuk-error-summary__body > p").then((el) => {
      assert.include(el.text(), "Enter at least one name or a postcode");
    });
  });
});
