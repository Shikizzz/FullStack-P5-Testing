/// <reference types="cypress" />

import { Session } from "./model"

// @ts-check
describe('Session administration spec', () => {

    let sessions: Session[] = [{
        "id": 1,
        "name": "TestSession",
        "date": new Date(1999, 12, 31),
        "teacher_id": 1,
        "description": "TestDescription",
        "users": [],
        "createdAt": new Date(),
        "updatedAt": new Date()
    }];

    let user = {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
    }

    let teachers = [{
        id: 1,
        lastName: "Johnny",
        firstName: "Doe",
        createdAt: new Date(),
        updatedAt: new Date()
    }]

    it('Creates session', () => {
        cy.visit('/login')

        cy.intercept('/api/auth/login', user)

        cy.intercept('/api/session', sessions) //future calls
        cy.intercept('/api/session', { times: 1 }, {}) // POST CALL
        cy.intercept('/api/session', { times: 1 }, []) //first GET call


        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
        cy.url().should('include', '/sessions')

        cy.intercept('/api/teacher', teachers)

        cy.get('[data-cy="create"]').click()
        cy.url().should('include', '/sessions/create')

        cy.get('input[formControlName=name]').type("TestSession")
        cy.get('input[formControlName=date]').type("1999-12-31")
        cy.get('[data-cy="teacher"]').click().type(`{enter}`)
        cy.get('[data-cy="description"]').click().type("TestDescription")
        cy.get('[data-cy="save"]').click()

        cy.url().should('include', '/sessions')
        cy.contains("Session created !")
        cy.contains("TestSession") //session displayed to User
    })

    it('Edits session', () => {
        cy.visit('/login')

        cy.intercept('/api/auth/login', user)

        let editedSessionsArray: Session[] = [{
            "id": 1,
            "name": "TestSessionUpdated",
            "date": new Date(),
            "teacher_id": 1,
            "description": "TestDescriptionUpdated",
            "users": [
            ],
            "createdAt": new Date(),
            "updatedAt": new Date()
        }];
        cy.intercept('/api/session', editedSessionsArray) //future calls
        cy.intercept('/api/session', { times: 1 }, sessions) //first GET call

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
        cy.url().should('include', '/sessions')

        cy.intercept('/api/teacher', teachers)

        cy.intercept(
            {
                method: 'GET',
                url: '/api/session/1',
            },
            sessions[0])

        cy.get('[data-cy="edit"]').click()
        cy.url().should('include', '/sessions/update')
        cy.contains("Update session")

        cy.intercept(
            {
                method: 'PUT',
                url: '/api/session/1',
            },
            {})

        cy.get('input[formControlName=name]').type("Updated")
        cy.get('input[formControlName=date]').type("1999-12-31")
        cy.get('[data-cy="teacher"]').click().type(`{enter}`)
        cy.get('[data-cy="description"]').click().type("Updated")
        cy.get('[data-cy="save"]').click()

        cy.url().should('include', '/sessions')
        cy.contains("Session updated !")
        cy.contains("TestSessionUpdated")
    })


    it('Deletes session', () => {
        cy.visit('/login')

        cy.intercept('/api/auth/login', user)

        cy.intercept('/api/session', []) //future calls
        cy.intercept('/api/session', { times: 1 }, sessions) //first GET call

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
        cy.url().should('include', '/sessions')

        cy.intercept('/api/teacher', teachers)

        cy.intercept(
            {
                method: 'GET',
                url: '/api/session/1',
            },
            sessions[0])

        cy.intercept(
            {
                method: 'DELETE',
                url: '/api/session/1',
            },
            {})

        cy.get('[data-cy="detail"]').click()
        cy.get('[data-cy="delete"]').click()
        cy.url().should('include', '/sessions')
        cy.contains("Session deleted !")
        cy.contains('TestSession').should('not.exist') //deleted
    })
})