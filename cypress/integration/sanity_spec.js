describe('Sanity', () => {
  it('Website loads', () => {
    cy.visit('/');
    cy.get('span').contains('הזנת מיקום ידנית').click();

    const addressInput = cy.get('input[name="streetAddress"]');

    addressInput.should('be.visible');

    addressInput.type('תל אב');

    const firstAddress = cy.get('li[data-reach-combobox-option]').first();

    firstAddress.should('be.visible');

    firstAddress.click();

    cy.wait(200);

    const showProtestsButton = cy.get('button').contains('הצגת הפגנות');

    showProtestsButton.click();

    cy.get('div[data-testid="protestCard"]', { timeout: 2000 }).its('length').should('be.gt', 1);
  });
});
