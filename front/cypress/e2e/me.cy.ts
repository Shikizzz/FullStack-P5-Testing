import { Session } from "./model";
/// <reference types="cypress" />
// @ts-check
describe('Me spec', () => {

    it('can see Me page', () => {
        // Logging in as non admin user 
        cy.visit('/login')
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                admin: false
            },
        });
        cy.intercept(
            {
                method: 'GET',
                url: '/api/session',
            },
            []).as('sessions')

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"wrongpassword"}{enter}{enter}`)

        cy.intercept(
            { method: 'GET', url: '/api/user/1', }, {
            body: {
                id: 1,
                email: "test@test.com",
                firstName: 'John',
                lastName: 'Doe',
                admin: false,
                createdAt: new Date()
            },
        });

        cy.get('[data-cy="account"]').click()
        cy.url().should('include', '/me')
        cy.contains("Name: John DOE")
    })

    it('can see NotFound page if url incorrect', () => {
        // Logging in as non admin user 
        cy.visit('/login')
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                admin: false
            },
        });
        cy.intercept(
            {
                method: 'GET',
                url: '/api/session',
            },
            []).as('sessions')

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"wrongpassword"}{enter}{enter}`)

        cy.visit('/nonexistingURL')
        cy.contains("Page not found !")
    })

})