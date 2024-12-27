import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

  const mockAuthService = {
    register: jest.fn()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should register when valid informations are submitted", () => {
    let registerRequest = { email: 'test@test.com', firstName: "John", lastName: "Doe", password: 'password' };
    component.form.setValue(registerRequest);
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(jest.fn());
    mockAuthService.register = jest.fn().mockReturnValue(of({}));

    component.submit();

    expect(mockAuthService.register).toHaveBeenCalledWith(registerRequest);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    expect(component.onError).toBe(false);
    mockAuthService.register.mockClear();
  });

  it("should register when valid informations are submitted", () => {
    let registerRequest = { email: 'test@test.com', firstName: "John", lastName: "Doe", password: 'password' };
    component.form.setValue(registerRequest);
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(jest.fn());
    mockAuthService.register = jest.fn(() => throwError(() => new Error));

    component.submit();

    expect(mockAuthService.register).toHaveBeenCalledWith(registerRequest);
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(component.onError).toBe(true);
    mockAuthService.register.mockClear();
  });

});
