import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMemberStepperComponent } from './new-member-stepper.component';

describe('NewMemberStepperComponent', () => {
  let component: NewMemberStepperComponent;
  let fixture: ComponentFixture<NewMemberStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMemberStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMemberStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
