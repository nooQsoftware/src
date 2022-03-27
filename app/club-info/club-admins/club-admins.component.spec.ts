import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubAdminsComponent } from './club-admins.component';

describe('ClubAdminsComponent', () => {
  let component: ClubAdminsComponent;
  let fixture: ComponentFixture<ClubAdminsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubAdminsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
