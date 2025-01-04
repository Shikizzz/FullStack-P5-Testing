/// <reference types="cypress" />

import { Session } from "./model"

// @ts-check
describe('Session administration spec', () => {

    it('Creates session', () => {
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
        cy.intercept(
            {
                method: 'GET',
                url: '/api/session',
            },
            []).as('session')


        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
        cy.url().should('include', '/sessions')

        cy.intercept(
            {
                method: 'GET',
                url: '/api/teacher',
            },
            [{
                id: 1,
                lastName: "Johnny",
                firstName: "Doe",
                createdAt: new Date(),
                updatedAt: new Date()
            }]).as('teachers')

        cy.get('[data-cy="create"]').click()
        cy.url().should('include', '/sessions/create')

        cy.intercept(
            {
                method: 'POST',
                url: '/api/session',
            },
            {})

        cy.get('input[formControlName=name]').type("TestSession")
        cy.get('input[formControlName=date]').type("1999-12-31")
        cy.get('[data-cy="teacher"]').click().type(`{enter}`)
        cy.get('[data-cy="description"]').click().type("TestDescription")
        cy.get('[data-cy="save"]').click()

        cy.url().should('include', '/sessions')
        cy.contains("Session created !")
    })

    it('Edits session', () => {
        cy.visit('/login')

        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'John',
                lastName: 'Doe',
                admin: true
            },
        })

        let sessionsArray: Session[] = [{
            "id": 1,
            "name": "TestSession",
            "date": new Date(),
            "teacher_id": 1,
            "description": "TestDescription",
            "users": [
            ],
            "createdAt": new Date(),
            "updatedAt": new Date()
        }];
        cy.intercept(
            {
                method: 'GET',
                url: '/api/session',
            },
            sessionsArray).as('sessions')

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
        cy.url().should('include', '/sessions')

        cy.intercept(
            {
                method: 'GET',
                url: '/api/teacher',
            },
            [{
                id: 1,
                lastName: "Johnny",
                firstName: "Doe",
                createdAt: new Date(),
                updatedAt: new Date()
            }]).as('teachers')

        cy.intercept(
            {
                method: 'GET',
                url: '/api/session/1',
            },
            sessionsArray[0])

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
    })


    it('Deletes session', () => {
        cy.visit('/login')

        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'John',
                lastName: 'Doe',
                admin: true
            },
        })
        let sessionsArray: Session[] = [{
            "id": 1,
            "name": "TestSession",
            "date": new Date(),
            "teacher_id": 1,
            "description": "TestDescription",
            "users": [
            ],
            "createdAt": new Date(),
            "updatedAt": new Date()
        }];
        cy.intercept(
            {
                method: 'GET',
                url: '/api/session',
            },
            sessionsArray).as('sessions')

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
        cy.url().should('include', '/sessions')

        cy.intercept(
            {
                method: 'GET',
                url: '/api/teacher/1',
            },
            {
                id: 1,
                lastName: "Johnny",
                firstName: "Doe",
                createdAt: new Date(),
                updatedAt: new Date()
            })

        cy.intercept(
            {
                method: 'GET',
                url: '/api/session/1',
            },
            sessionsArray[0])

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
    })
})