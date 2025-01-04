/// <reference types="cypress" />
// @ts-check
describe('Register spec', () => {
    it('Register successfull', () => {
        cy.visit('/register')

        cy.intercept('POST', '/api/auth/register', {
            body: {}, //returns void
        })
        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=firstName]').type("John")
        cy.get('input[formControlName=lastName]').type("Doe")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

        cy.url().should('include', '/login')
    })

    it('Register denied (email already taken)', () => {
        cy.visit('/register')

        cy.intercept('POST', '/api/auth/register', { statusCode: 400 }) //returns error

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=firstName]').type("John")
        cy.get('input[formControlName=lastName]').type("Doe")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

        cy.url().should('include', '/register')
        cy.contains("An error occurred")
    })

});