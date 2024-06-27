describe('E2E Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains('norway airports');
  });
});
