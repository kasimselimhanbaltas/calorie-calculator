import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaloriesIntakeComponent } from './calories-intake.component';

describe('CaloriesIntakeComponent', () => {
  let component: CaloriesIntakeComponent;
  let fixture: ComponentFixture<CaloriesIntakeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaloriesIntakeComponent]
    });
    fixture = TestBed.createComponent(CaloriesIntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
