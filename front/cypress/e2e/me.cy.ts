import { Session } from "./model";
/// <reference types="cypress" />
// @ts-check
describe('Me spec', () => {

    it('can see Me page and go Back', () => {
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
        cy.intercept('/api/session', [])

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

        cy.get('[data-cy="back"]').click()
        cy.url().should('include', '/sessions')
    })

    it('can see Me page and Delete its account', () => {
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
        cy.intercept('/api/session', [])

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

        cy.intercept({ method: 'DELETE', url: '/api/user/1', }, { body: {}, });

        cy.get('[data-cy="delete"]').click()
        cy.contains("Your account has been deleted !")
        cy.url().should('eq', 'http://localhost:4200/')
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
        cy.intercept('/api/session', [])

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"wrongpassword"}{enter}{enter}`)

        cy.visit('/nonexistingURL')
        cy.contains("Page not found !")
    })

})