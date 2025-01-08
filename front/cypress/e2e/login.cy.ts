/// <reference types="cypress" />
// @ts-check
describe('Login spec', () => {
    it('Login successfull', () => {
        cy.visit('/login')

        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                admin: true
            },
        })
        cy.intercept('/api/session', [])

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

        cy.url().should('include', '/sessions')
    })

    it('Login denied by Backend', () => {
        cy.visit('/login')

        cy.intercept('POST', '/api/auth/login', { statusCode: 401 })

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"wrongpassword"}{enter}{enter}`)

        cy.url().should('include', '/login')
        cy.contains("An error occurred")
    })

    it('Login denied in front because of email validators', () => {
        cy.visit('/login')

        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                admin: true
            },
        })

        cy.intercept('/api/session', [])

        cy.get('input[formControlName=email]').type("yogastudio")
        cy.get('input[formControlName=password]').type(`${"password"}`)
        cy.get('[data-cy="submit"]').should('be.disabled')
    })

    it('Login denied in front because of password validators', () => {
        cy.visit('/login')

        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                admin: true
            },
        })

        cy.intercept('/api/session', [])

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('[data-cy="submit"]').should('be.disabled')
    })

    it('Logout successfull', () => {
        cy.visit('/login')

        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                admin: true
            },
        })
        cy.intercept('/api/session', [])

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

        cy.get('[data-cy="logout"]').click()
        cy.visit('/sessions');
        cy.url().should('include', '/login') //redirection verification
    })
});