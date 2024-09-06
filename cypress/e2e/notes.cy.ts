// cypress/e2e/notes.cy.ts
describe('Notes Functionality', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('creates a new note', () => {
    cy.contains('Create New Note').click()
    cy.get('input[placeholder="Enter note title"]').type('Cypress Test Note')
    cy.get('textarea[placeholder="Enter note content"]').type('This is a test note created by Cypress')
    cy.contains('Create').click()
    cy.contains('Cypress Test Note').should('be.visible')
  })

  it('edits an existing note', () => {
    cy.contains('Cypress Test Note').parent().find('button[aria-label="Edit note"]').click()
    cy.get('input[placeholder="Enter note title"]').clear().type('Updated Cypress Test Note')
    cy.contains('Update').click()
    cy.contains('Updated Cypress Test Note').should('be.visible')
  })

  it('deletes a note', () => {
    cy.contains('Updated Cypress Test Note').parent().find('button[aria-label="Edit note"]').click()
    cy.contains('Delete').click()
    cy.contains('Updated Cypress Test Note').should('not.exist')
  })
})