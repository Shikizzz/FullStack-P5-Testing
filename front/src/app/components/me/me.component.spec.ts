import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { of } from 'rxjs';

import { MeComponent } from './me.component';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  let mockUser: User = {
    id: 1,
    email: 'test@test.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: true,
    password: 'testpassword',
    createdAt: new Date()
  } as User

  const mockUserService = {
    getById: jest.fn().mockReturnValue(of(mockUser)),
    delete: jest.fn().mockReturnValue(of({}))  // Backend response is empty when calling httpclient.delete
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    },
    logOut: jest.fn()   //Faking logout function to do nothing
  }

  const mockRouter = {
    navigate: jest.fn() // Mocking navigate() function to do nothing
  };

  const mockMatSnackBar = {
    open: jest.fn() // Mocking open() function to do nothing
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    component.ngOnInit();
    expect(mockUserService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(expect.objectContaining(mockUser));
  });

  it('should call window.history.back() function when back() function is called', () => {
    const backSpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(backSpy).toHaveBeenCalled();
    backSpy.mockClear(); //Not needed, but good practice
  });

  it('should call userService.delete(), MatSnackBar.open(), SessionService.logout() and Router.navigate() when delete() called', () => {
    component.delete();
    expect(mockUserService.delete).toHaveBeenCalledWith('1');
    expect(mockMatSnackBar.open).toHaveBeenCalled();
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

});