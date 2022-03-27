import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingMemberComponent } from './existing-member.component';

describe('ExistingMemberComponent', () => {
  let component: ExistingMemberComponent;
  let fixture: ComponentFixture<ExistingMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
