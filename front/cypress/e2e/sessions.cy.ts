/// <reference types="cypress" />
// @ts-check
import { Session } from "./model";
describe('Sessions spec', () => {
    it('redirects to login if not connected', () => {
        cy.visit('/sessions')
        cy.url().should('include', '/login')
    })

    it('can participate if not already paricipating', () => {
        // Logging in as non admin user to participate to a session
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

        cy.intercept(
            {
                method: 'GET',
                url: '/api/session/1',
            },
            sessionsArray[0]).as('session')

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
            }).as('teacher')

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
        cy.url().should('include', '/sessions')
        cy.contains("TestSession")

        cy.get('[data-cy="detail"]').click()
        cy.contains("JOHNNY")
        cy.contains("Participate")
        cy.contains("0 attendees")
        /*
                cy.intercept(
                    {
                        method: 'POST',
                        url: '/api/session/1/participate/1',
                    },
                    {}).as('participate')
        
                cy.get('[data-cy="participate"]').click()*/
    })

    it('can unparticipate if already paricipating', () => {
        // Logging in as non admin user to participate to a session
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
        let sessionsArray: Session[] = [{
            "id": 1,
            "name": "TestSession",
            "date": new Date(),
            "teacher_id": 1,
            "description": "TestDescription",
            "users": [1],
            "createdAt": new Date(),
            "updatedAt": new Date()
        }];

        cy.intercept(
            {
                method: 'GET',
                url: '/api/session',
            },
            sessionsArray).as('sessions')

        cy.intercept(
            {
                method: 'GET',
                url: '/api/session/1',
            },
            sessionsArray[0]).as('session')

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
            }).as('teacher')

        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
        cy.url().should('include', '/sessions')
        cy.contains("TestSession")

        cy.get('[data-cy="detail"]').click()
        cy.contains("JOHNNY")
        cy.contains("Do not participate")
        cy.contains("1 attendees")
    })
});