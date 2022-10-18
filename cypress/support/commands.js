Cypress.Commands.add('clickButton', (buttonText) => {
    cy.get('button')
        .contains(buttonText)
        .should('be.visible')
        .click();
});

Cypress.Commands.add('clickLink', (linkText) => {
    cy.get('a')
        .contains(linkText)
        .should('be.visible')
        .click();
});

Cypress.Commands.add('confirmTitle', (expectedTitle) => {
    cy.title().should('include', expectedTitle);
});

Cypress.Commands.add('login', () => {
    const username = Cypress.env('login');

    cy.visit('')
        .confirmTitle('Wikipedia, the free encyclopedia')
        .clickLink('Log in')
        .confirmTitle('Log in');

    cy.get('#wpName1')
        .type(username);

    cy.get('#wpPassword1')
        .type(Cypress.env('password'));

    cy.clickButton('Log in')
        .get('a[title^="Your homepage"]')
        .should('be.visible')
        .should('contain.text', username);
});

Cypress.Commands.add('clearWatchlist', () => {
    cy.visit('/wiki/Special:EditWatchlist/clear');

    cy.clickButton('Clear the watchlist (This is permanent!)');

    cy.get('#mw-content-text').should('contain.text', 'Your watchlist has been cleared.');
});
