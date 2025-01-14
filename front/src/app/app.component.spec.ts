import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';


describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let router: Router;

  const mockSessionService = {
    logOut: jest.fn(), // Mocking logOut() function to do nothing
    $isLogged: jest.fn().mockReturnValue(of(true))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should logout when logout buttonn is clicked', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    app.logout();
    expect(mockSessionService.logOut).toBeCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });

});

/*--------------- INTEGRATION TESTS ------------------*/

describe('AppComponentIntegration', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
    })
      .compileComponents()
    sessionService = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app, with unlogged user', () => {
    const $isLogged: Observable<boolean> = app.$isLogged();
    let isLogged!: boolean;
    $isLogged.subscribe(bool => isLogged = bool);

    expect(isLogged).toBe(false);
  });

  it('should logout when logout buttonn is clicked', () => {
    sessionService.isLogged = true;
    const navigateSpy = jest.spyOn(Router.prototype as any, 'navigate').mockImplementation(jest.fn());

    app.logout();

    expect(sessionService.isLogged = false);
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });
});
