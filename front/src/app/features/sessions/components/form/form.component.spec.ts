import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { Session } from '../../interfaces/session.interface';
import { of } from 'rxjs';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { TeacherService } from 'src/app/services/teacher.service';


describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionService: SessionService;
  let router: Router;

  const teacher = {
    id: 1,
    lastName: "Doe",
    firstName: "John",
    createdAt: new Date,
    updatedAt: new Date,
  } as Teacher

  let teachers: Teacher[] = [];
  teachers.push(teacher)

  const mockTeacherService = {
    all: jest.fn().mockReturnValue(of(teachers))
  };

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: SessionService },
        { provide: SessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ 'id': '1' }) } }
        }
      ],
      declarations: [FormComponent]
    })
      .compileComponents();
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
    sessionService.sessionInformation = sessionInformation;
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to "/sessions" if user is not admin', () => {
    sessionInformation.admin = false;
    sessionService.sessionInformation = sessionInformation;

    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(jest.fn());

    component.ngOnInit();

    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
    navigateSpy.mockClear();
  });

  it('should init form basing on the session', () => {
    sessionInformation.admin = true;
    sessionService.sessionInformation = sessionInformation;
    let form = {
      "name": session.name,
      "date": new Date(session.date).toISOString().split('T')[0],
      "teacher_id": session.teacher_id,
      "description": session.description
    };
    const includesSpy = jest.spyOn(String.prototype as any, 'includes').mockReturnValue(true);
    const httpSpy = jest.spyOn(HttpClient.prototype as any, 'get').mockReturnValue(of(session)); //mocking call to back
    component.ngOnInit();

    expect(includesSpy).toHaveBeenCalledWith('update');
    expect(component.onUpdate).toBe(true);
    expect(httpSpy).toHaveBeenCalledWith("api/session/1");
    expect(component.sessionForm?.value).toEqual(form);
    includesSpy.mockClear();
    httpSpy.mockClear();
  });

  it('should init empty form', () => {
    sessionInformation.admin = true;
    sessionService.sessionInformation = sessionInformation;
    component.onUpdate = false;
    let form = {
      "name": '',
      "date": '',
      "teacher_id": '',
      "description": ''
    };
    const includesSpy = jest.spyOn(String.prototype as any, 'includes').mockReturnValue(false);

    component.ngOnInit();

    expect(includesSpy).toHaveBeenCalledWith('update');
    expect(component.onUpdate).toBe(false);
    expect(component.sessionForm?.value).toEqual(form);
    includesSpy.mockClear();
  });

  it('should create session on submit', () => {
    component.onUpdate = false;
    let formTest: any = {
      name: 'TestSession',
      date: '01/01/2030',
      teacher_id: '1',
      description: 'test'
    }
    component.sessionForm?.setValue(formTest);
    const httpSpy = jest.spyOn(HttpClient.prototype as any, 'post').mockReturnValue(of(formTest as Session)); //mocking call to back
    const matSnackBarSpy = jest.spyOn(MatSnackBar.prototype as any, 'open').mockImplementation(jest.fn());
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(jest.fn());

    component.submit();

    expect(httpSpy).toHaveBeenCalledWith("api/session", formTest as Session);
    expect(matSnackBarSpy).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
    httpSpy.mockClear();
    matSnackBarSpy.mockClear();
    navigateSpy.mockClear();
  });

  it('should update session on submit', () => {
    /*--- Calling OnInit to set component.id to 1 --- */
    sessionInformation.admin = true;
    sessionService.sessionInformation = sessionInformation;
    let form: any = {
      "name": session.name,
      "date": new Date(session.date).toISOString().split('T')[0],
      "teacher_id": session.teacher_id,
      "description": session.description
    };
    const includesSpy = jest.spyOn(String.prototype as any, 'includes').mockReturnValue(true);
    const httpDetailSpy = jest.spyOn(HttpClient.prototype as any, 'get').mockReturnValue(of(session)); //mocking call to back
    component.ngOnInit();
    includesSpy.mockClear();
    httpDetailSpy.mockClear();
    /*------*/
    component.sessionForm?.setValue(form);
    const httpUpdateSpy = jest.spyOn(HttpClient.prototype as any, 'put').mockReturnValue(of(form as Session)); //mocking call to back
    const matSnackBarSpy = jest.spyOn(MatSnackBar.prototype as any, 'open').mockImplementation(jest.fn());
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(jest.fn());

    component.submit();

    expect(httpUpdateSpy).toHaveBeenCalledWith("api/session/1", form as Session);
    expect(matSnackBarSpy).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
    httpUpdateSpy.mockClear();
    matSnackBarSpy.mockClear();
    navigateSpy.mockClear();
  });
});
