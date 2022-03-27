import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberAutocompleteComponent } from './member-autocomplete.component';

describe('MemberAutocompleteComponent', () => {
  let component: MemberAutocompleteComponent;
  let fixture: ComponentFixture<MemberAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
