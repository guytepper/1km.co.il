import 'cypress-wait-until';

beforeEach(() => {
  cy.clearLocalStorage();
  cy.reload();
});

const selectors = {
  showProtestsBtn: () => cy.get('button').contains('הצגת הפגנות').parent('button'),
  protestCards: () => cy.get('div[data-testid="protestCard"]'),
  autocompleteResults: () => cy.get('li[data-reach-combobox-option]'),
  manualLocationBtn: () => cy.get('span').contains('הזנת מיקום ידנית'),
  autoLocationBtn: () => cy.get('span').contains('מציאת הפגנות באיזורי'),
};

function fakeLocation(latitude = 31.7749837, longitude = 35.219797) {
  return {
    onBeforeLoad(win) {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition', (cb, err) => {
        if (latitude && longitude) {
          return cb({ coords: { latitude, longitude } });
        }
        throw err({ code: 1 }); // 1: rejected, 2: unable, 3: timeout
      });
    },
  };
}

describe('Location modal', () => {
  it('should show results when using user location', () => {
    cy.visit('/', fakeLocation());

    selectors.autoLocationBtn().click();

    cy.waitUntil(function () {
      return selectors.protestCards().should('exist');
    });

    selectors.protestCards().its('length').should('be.gt', 1);
    selectors.protestCards().first().get('[data-testid="protestCard__streetAddress"]').should('contain.text', 'ירושלים');
  });

  it('Should show results when searching for address manually', () => {
    cy.visit('/');

    // Show address input
    selectors.manualLocationBtn().click();

    // Type street address
    const addressInput = cy.get('input[name="streetAddress"]');
    addressInput.should('be.visible');
    addressInput.type('תל אב');

    // Select first result
    const firstAddress = selectors.autocompleteResults().first();
    firstAddress.should('be.visible');
    firstAddress.click();

    // Click show protests
    cy.waitUntil(() => {
      return selectors.showProtestsBtn().should('not.be.disabled');
    });
    selectors.showProtestsBtn().click();

    // Assert protest cards exist
    cy.waitUntil(function () {
      return selectors.protestCards().should('exist');
    });
    selectors.protestCards().its('length').should('be.gt', 1);
  });
});

describe('Add protest', () => {
  it('should successfully add a protest', () => {
    cy.visit('/add-protest', fakeLocation());

    cy.get('input[name="displayName"]').type('בדיקה');

    cy.get('input[name="streetAddress"]').type('באר שבע');
    const firstAddress = selectors.autocompleteResults().first();
    firstAddress.should('be.visible');
    firstAddress.click();

    cy.wait(200);

    cy.get('input[name="meeting_date"]').type('2020-10-23');
    cy.get('input[name="meeting_time"]').type('17:30');
    cy.get('input[name="email"]').type('uriklar@gmail.com');

    cy.get('button[type="submit"]').click();

    cy.get('h2').contains('ההפגנה נשלחה בהצלחה').should('exist');
  });
});
