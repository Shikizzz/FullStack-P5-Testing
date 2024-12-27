import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { Router } from '@angular/router';
import { Session } from '../../interfaces/session.interface';
import { Observable, of } from 'rxjs';


describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let router: Router;
  let sessionApiService: SessionApiService;



  let mockSessionService = {
    sessionInformation: {
      token: 'token',
      type: 'jwt',
      id: 1,
      username: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    }
  }

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
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: sessionApiService },
      ],
      declarations: [FormComponent]
    })
      .compileComponents();
    sessionApiService = TestBed.inject(SessionApiService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  /*
    it('should redirect to "/sessions" if user is not admin', () => {
      //mockSessionService.sessionInformation.admin = false;
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(jest.fn());
      const includesSpy = jest.spyOn(String.prototype, 'includes').mockImplementation(jest.fn());
      component.ngOnInit;
      expect(navigateSpy).toHaveBeenCalled();//With(['/sessions']);
      expect(includesSpy).not.toHaveBeenCalled();
    });
  */
  /* it('should create', () => {
     let session: Session = {
       id: 1,
       name: "string",
       description: "string",
       date: new Date,
       teacher_id: 1,
       users: [],
       createdAt: new Date,
       updatedAt: new Date
     };
     const createSpy = jest.spyOn(SessionApiService.prototype as any, "create").mockImplementation(jest.fn(() => of(session)));
     const exitPageSpy = jest.spyOn(FormComponent.prototype as any, 'exitPage').mockImplementation(jest.fn());
     component.sessionForm = {} as FormGroup;
     component.sessionForm.setValue(session); //not a function
 
     component.onUpdate = false;
     component.submit;
 
     expect(createSpy).toHaveBeenCalledWith(session);
     expect(exitPageSpy).toHaveBeenCalled();
   });*/
});
