import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipIntegrationComponent } from './membership-integration.component';

describe('MembershipIntegrationComponent', () => {
  let component: MembershipIntegrationComponent;
  let fixture: ComponentFixture<MembershipIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
