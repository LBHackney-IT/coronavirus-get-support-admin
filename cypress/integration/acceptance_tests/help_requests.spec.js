describe("...", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("it succesfully loads the dashboard", async () => {
    cy.contains("Dashboard");
  });
  it("can navigate to get help requests", async () => {
    cy.get('a[href*="help-requests"]').click();
    cy.url().should("include", "/help-requests");
    cy.get('a[href*="/help-requests/search"]').click();
    cy.get("input").type("E1");
    cy.get("button").click();
  });
});
