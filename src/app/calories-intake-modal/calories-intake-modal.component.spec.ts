import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaloriesIntakeModalComponent } from './calories-intake-modal.component';

describe('CaloriesIntakeModalComponent', () => {
  let component: CaloriesIntakeModalComponent;
  let fixture: ComponentFixture<CaloriesIntakeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaloriesIntakeModalComponent]
    });
    fixture = TestBed.createComponent(CaloriesIntakeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
