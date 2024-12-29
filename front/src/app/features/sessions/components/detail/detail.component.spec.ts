import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { SessionApiService } from '../../services/session-api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }

  const mockSessionApiService = {
    delete: jest.fn().mockReturnValue(of({})),
    participate: jest.fn().mockReturnValue(of({})),
    unParticipate: jest.fn().mockReturnValue(of({})),
    detail: jest.fn().mockReturnValue(of({
      id: 1,
      name: "YogaSession",
      description: "description",
      date: new Date,
      teacher_id: 1,
      users: [],
      createdAt: new Date,
      updatedAt: new Date
    }))
  };

  const mockMatSnackBar = {
    open: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatSnackBarModule,
        ReactiveFormsModule,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    })
      .compileComponents();
    router = TestBed.inject(Router);
    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session on Init', () => {
    const fetchSpy = jest.spyOn(DetailComponent.prototype as any, 'fetchSession').mockImplementation(jest.fn());

    component.ngOnInit();

    expect(fetchSpy).toHaveBeenCalled();
    fetchSpy.mockClear();
  });

  it('should call window.history.back() function when back() function is called', () => {
    const backSpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(backSpy).toHaveBeenCalled();
    backSpy.mockClear();
  });

  it('should delete the session when button clicked', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(jest.fn());

    component.delete();

    expect(mockMatSnackBar.open).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should call sessionApiService.participate when participate button clicked', () => {
    component.participate();
    expect(mockSessionApiService.participate).toHaveBeenCalled();
  });
});

/*--------------- INTEGRATION TESTS ------------------*/

describe('DetailComponentIntegration', () => {
  let component: DetailComponent;
  let sessionService: SessionService;
  let fixture: ComponentFixture<DetailComponent>;

  let sessionInformation = {
    admin: true,
    id: 1
  } as SessionInformation;

  let session = {
    id: 1,
    name: "YogaSession",
    description: "description",
    date: new Date,
    teacher_id: 1,
    users: [],
    createdAt: new Date,
    updatedAt: new Date
  } as Session;

  const teacher = {
    id: 1,
    lastName: "Doe",
    firstName: "John",
    createdAt: new Date,
    updatedAt: new Date,
  } as Teacher

  beforeEach(async () => {

    session.users = [];

    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      providers: [{ provide: SessionService }]
    })
      .compileComponents();
    sessionService = TestBed.inject(SessionService);
    sessionService.sessionInformation = sessionInformation;
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /*
    it('should fetch session on init', () => {
      //sessionService.isLogged = true; //not the problem ?
      component.sessionId = "1";
      const httpSpy = jest.spyOn(HttpClient.prototype as any, 'get')
        .mockReturnValueOnce(of(session)) //mocking sessionApiService.detail call to back
        .mockReturnValueOnce(of(teacher)); //mocking teacherService.detail call to back
  
      component.ngOnInit();
  
      expect(httpSpy).toHaveBeenCalled();//With("api/session/1");
      expect(component.session).toBe(session);
      expect(component.isParticipate).toBe(false);
      expect(httpSpy).toHaveBeenCalledWith("api/teacher/1");
      expect(component.teacher).toBe(teacher);
      httpSpy.mockClear();
    });*/

  it('should delete the session when delete() function called', () => {
    component.sessionId = "1";
    const httpSpy = jest.spyOn(HttpClient.prototype as any, 'delete').mockReturnValue(of({})); //mocking sessionApiService.delete call to back
    const matSnackBarSpy = jest.spyOn(MatSnackBar.prototype as any, 'open').mockImplementation(jest.fn());
    const navigateSpy = jest.spyOn(Router.prototype as any, 'navigate').mockImplementation(jest.fn());

    component.delete();

    expect(httpSpy).toHaveBeenCalledWith("api/session/1");
    expect(matSnackBarSpy).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
    httpSpy.mockClear();
    matSnackBarSpy.mockClear();
    navigateSpy.mockClear();
  });
  /*
    it('should add the user in the session when participate() function called', () => {
      component.sessionId = "1";
      component.userId = "42"
      const httpSpy = jest.spyOn(HttpClient.prototype as any, 'post').mockReturnValue(of({})); //mocking sessionApiService.participate call to back
      session.users.push(42); //user have been added to the session's users
      const httpFetchSpy = jest.spyOn(HttpClient.prototype as any, 'get')
        .mockReturnValueOnce(of(session)) //mocking sessionApiService.detail call to back
        .mockReturnValueOnce(of(teacher)); //mocking teacherService.detail call to back
  
      component.participate();
  
      expect(httpSpy).toHaveBeenCalledWith("api/session/1/participate/42", null);
      // fetchSession is called Successfully here
      expect(httpFetchSpy).toHaveBeenCalledWith("api/session/1");
      expect(component.isParticipate).toBe(true);
      expect(component.teacher).toBe(teacher);
      httpSpy.mockClear();
      httpFetchSpy.mockClear();
    });*/
  /*
    it('should add the user in the session when participate() function called', () => {
      component.sessionId = "1";
      component.userId = "42"
      component.session?.users.push(42);
      session.users.push(42);
      component.isParticipate = true;
      const httpSpy = jest.spyOn(HttpClient.prototype as any, 'delete').mockReturnValue(of({})); //mocking sessionApiService.unParticipate call to back
      session.users.pop(); //user have been removed to the session's users
      const httpFetchSpy = jest.spyOn(HttpClient.prototype as any, 'get')
        .mockReturnValueOnce(of(session)) //mocking sessionApiService.detail call to back
        .mockReturnValueOnce(of(teacher)); //mocking teacherService.detail call to back
  
      component.unParticipate();
  
      expect(httpSpy).toHaveBeenCalledWith("api/session/1/participate/42");
      expect(httpFetchSpy).toHaveBeenCalledWith("api/session/1");
      expect(component.isParticipate).toBe(false);
      expect(component.teacher).toBe(teacher);
      httpSpy.mockClear();
      httpFetchSpy.mockClear();
    });*/
});

