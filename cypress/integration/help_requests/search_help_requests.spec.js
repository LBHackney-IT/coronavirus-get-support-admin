describe("search help requests", () => {
  let postcode;
  beforeEach(() => {
    cy.visit("/");
    cy.get('a[href*="help-requests"]').click();
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="/help-requests/search"]').click();
  });
  
  /** 
   * It is missing data setup: it should first create a new record then search by postcode to verify it exists in the callback table.
   * We will come back to this
   * 
  it("can retrieve all help request for a valid postcode", () => {
    postcode = "E1";
    cy.get("input").type(postcode);
    cy.get("button").click();
    cy.get("tbody > tr > td").then((el) => {
      assert.include(el.text(), "ALBERT");
    });
  });
   */

  it("does not error when there are no requests from a valid postcode", () => {
    postcode = "E4";
    cy.get("input").type(postcode);
    cy.get("button").click();
    cy.get("h3").then((el) => {
      assert.include(el.text(), `No records found with postcode: ${postcode}`);
    });
  });

  it("requires a valid postcode to retrieve help request in the area", () => {
    postcode = "dfaw32";
    cy.get("input").type(postcode);
    cy.get("button").click();
    cy.get("div > form > div > span").then((el) => {
      assert.include(el.text(), "Enter a valid postcode");
    });
  });
});
