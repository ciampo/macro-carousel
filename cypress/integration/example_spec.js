describe('My First Test', function() {
  it('Does not do much!', function() {
    cy.visit('localhost:8080/demo/base.html')

    cy.wait(2000);
    cy.get('x-slider').get(0).its('constructor.name').should('eq', 'XSlider');
  })
})