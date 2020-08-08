describe("...", () => {
  beforeEach(() => {
    cy.visit("/");
    debugger;
  });
  it("it succesfully loads the dashboard", () => {
    cy.contains("Dashboard");
  });
  it("can navigate to get help requests", () => {
    cy.get('a[href*="help-requests"]').click();
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="/help-requests/search"]').click();
    cy.get("input").type("E1");
    cy.get("button").click();
  });
});
