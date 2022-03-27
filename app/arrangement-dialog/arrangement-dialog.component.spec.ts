import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrangementDialogComponent } from './arrangement-dialog.component';

describe('ArrangementDialogComponent', () => {
  let component: ArrangementDialogComponent;
  let fixture: ComponentFixture<ArrangementDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrangementDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrangementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
