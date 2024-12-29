import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('LoginComponent', () => { //Unit tests
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  const mockSessionService = {
    logIn: jest.fn()
  }

  const mockSessionInformation: SessionInformation = {
    token: 'token',
    type: 'jwt',
    id: 1,
    username: 'JohnDoe',
    firstName: 'John',
    lastName: 'Doe',
    admin: false
  }
  const mockAuthService = {
    login: jest.fn()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: AuthService, useValue: mockAuthService }],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should login when valid informations are submitted", () => {
    let loginRequest = { email: 'test@test.com', password: 'password' };
    component.form.setValue(loginRequest);
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(jest.fn());
    mockAuthService.login.mockReturnValue(of(mockSessionInformation));// returns an observable of SessionInformation

    component.submit();

    expect(mockAuthService.login).toHaveBeenCalledWith(loginRequest);
    expect(mockSessionService.logIn).toHaveBeenCalledWith(mockSessionInformation);
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
    expect(component.onError).toBe(false);
    mockSessionService.logIn.mockClear();
    mockAuthService.login.mockRestore();
    navigateSpy.mockClear();
  });

  it("should throw error if unvalid informations are submitted", () => {
    let loginRequest = { email: 'test@test.com', password: 'password' };
    mockAuthService.login.mockReturnValue(throwError(() => new Error));
    const navigateSpy = jest.spyOn(router, 'navigate')
    component.form.setValue(loginRequest);

    component.submit();

    expect(mockAuthService.login).toHaveBeenCalledWith(loginRequest);
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(mockSessionService.logIn).not.toHaveBeenCalled();
    expect(component.onError).toBe(true);

    mockSessionService.logIn.mockClear();
    mockAuthService.login.mockRestore();
    navigateSpy.mockClear();
  });
});

/*--------------- INTEGRATION TESTS ------------------*/

describe('LoginComponentIntegration', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let loginRequest = { email: 'test@test.com', password: 'password' };

  const mockSessionInformation: SessionInformation = {
    token: 'token',
    type: 'jwt',
    id: 1,
    username: 'JohnDoe',
    firstName: 'John',
    lastName: 'Doe',
    admin: false
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers:
        [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should login when valid informations are submitted", () => {
    component.form.setValue(loginRequest);
    const httpSpy = jest.spyOn(HttpClient.prototype as any, 'post').mockReturnValue(of(mockSessionInformation)); //mocking call to back
    const logInSpy = jest.spyOn(SessionService.prototype as any, 'logIn')
    const navigateSpy = jest.spyOn(Router.prototype as any, 'navigate').mockImplementation();

    component.submit();

    expect(httpSpy).toHaveBeenCalledWith("api/auth/login", loginRequest);
    expect(logInSpy).toHaveBeenCalledWith(mockSessionInformation);
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
    expect(component.onError).toBe(false);
    logInSpy.mockClear();
    httpSpy.mockRestore();
    navigateSpy.mockClear();
  });

  it("should not login when wrong credentials submitted", () => {
    component.form.setValue(loginRequest);
    const httpSpy = jest.spyOn(HttpClient.prototype as any, 'post').mockReturnValue(throwError(() => new Error));
    const logInSpy = jest.spyOn(SessionService.prototype as any, 'logIn')
    const navigateSpy = jest.spyOn(Router.prototype as any, 'navigate')

    component.submit();

    expect(httpSpy).toHaveBeenCalledWith("api/auth/login", loginRequest);
    expect(logInSpy).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(component.onError).toBe(true);
    logInSpy.mockClear();
    httpSpy.mockRestore();
    navigateSpy.mockClear();
  });

});
