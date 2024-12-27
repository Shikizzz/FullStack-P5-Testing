import { HttpClientModule } from '@angular/common/http';
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
import { MatCard, MatCardModule, MatCardTitle } from '@angular/material/card';


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

