import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExclusionComponent } from './new-exclusion.component';

describe('NewExclusionComponent', () => {
  let component: NewExclusionComponent;
  let fixture: ComponentFixture<NewExclusionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewExclusionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExclusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
