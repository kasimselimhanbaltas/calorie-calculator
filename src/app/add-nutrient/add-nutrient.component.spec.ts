import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNutrientComponent } from './add-nutrient.component';

describe('AddNutrientComponent', () => {
  let component: AddNutrientComponent;
  let fixture: ComponentFixture<AddNutrientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNutrientComponent]
    });
    fixture = TestBed.createComponent(AddNutrientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
