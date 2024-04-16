//login session for student
Cypress.Commands.add('loginStudent', (username, password) => {
  cy.session([username, password], () => {
    cy.visit('/');
    cy.get('.btn-navigate', { timeout: 20000 }).should('be.visible');
    cy.get('.btn-navigate').eq(1).click();
    cy.get('[type="submit"]').should('be.visible');
    cy.get('[name="userName"]').type(username);
    cy.get('[name="password"]').type(password);
    cy.get('[type="submit"]').click();
    cy.viewport(1920, 937);
  });
});




