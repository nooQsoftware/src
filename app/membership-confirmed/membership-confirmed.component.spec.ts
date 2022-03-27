import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipConfirmedComponent } from './membership-confirmed.component';

describe('MembershipConfirmedComponent', () => {
  let component: MembershipConfirmedComponent;
  let fixture: ComponentFixture<MembershipConfirmedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipConfirmedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
