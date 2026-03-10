describe('dashboard', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the site overview heading', () => {
    cy.get('h1')
    .contains('Site Overview');
  })
  it('renders the stats grid', () => {
    cy.get('.stats-grid')
    .should('be.visible')
    .find('.stat-card')
    .should('have.length.greaterThan', 0);
  })
})
