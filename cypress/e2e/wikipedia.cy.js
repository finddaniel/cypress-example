describe('the Wikipedia website', () => {
    before(() => {
        cy.intercept({
            method: 'GET',
            url: '/wiki/Special:CentralAutoLogin/**',
        }).as('getSession');

        cy.login();

        cy.wait('@getSession');

        cy.clearWatchlist();
    });

    it('should allow users to add articles to their watchlist', () => {
        cy.wrap([1, 2])
            .each(() => {
                cy.clickLink('Random article')
                    .get('#firstHeading')
                    .should('be.visible')
                    .then(($titleHeader) => {
                        cy.get('a[title^="Add this page to your watchlist"]')
                            .click();

                        const expectedText = `"${$titleHeader.text()}" and its talk page have been added to your watchlist permanently.`;

                        cy.get('body').then($body => {
                            // Cypress doesn't seem to provide a more elegant way to conditionally handle non-deterministic behavior...
                            if ($body.find('button[type="submit"]').length > 0) {
                                // After clicking the "Add to wishlist" link above, Wikipedia may respond with a full-page alert
                                //  that requires an additional action to ensure the article is added successfully
                                cy.get('button[type="submit"]')
                                    .click();

                                cy.get('#mw-content-text')
                                    .should('contain.text', expectedText);
                            } else {
                                // Othertimes Wikipedia responds with a pop-up notification that does not require any additional
                                // action to ensure the article is added successfully.
                                cy.get('#mw-notification-area label')
                                    .first()
                                    .should('be.visible')
                                    .should('contain.text', expectedText);
                            }
                        });
                    });
            });
    });

    it('should allow users to remove articles from their watchlist', () => {
        cy.visit('/wiki/Special:EditWatchlist')
            .confirmTitle('Edit watchlist');

        cy.get('fieldset input[type="checkbox"]')
            .first()
            .then($checkbox => {
                $checkbox.click();

                expect($checkbox).to.be.checked;

                cy.clickButton('Remove titles')
                    .get('#mw-content-text')
                    .should('contain.text', 'A single title was removed from your watchlist:');

                cy.get(`li a[title="${$checkbox.attr('value')}"]`)
                    .should('be.visible');
            });
    });

    it('should allow users to access articles directly from their watchlist', () => {
        cy.visit('/wiki/Special:EditWatchlist')
            .confirmTitle('Edit watchlist');

        cy.get('fieldset[id^="editwatchlist"] a')
            .first()
            .then($articleLink => {
                cy.wrap($articleLink).click();

                cy.get('#firstHeading')
                    .should('be.visible');

                cy.confirmTitle(`${$articleLink.attr('title')}`);
            });
    });
});
