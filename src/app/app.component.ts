import { Component, Output } from '@angular/core';
import "../../node_modules/bootstrap/dist/js/bootstrap.min.js"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'calorie-calculator';
  nutrientVar: any;
  // onNutrientDeleted(nutrient: any) {
  //   this.nutrientVar = nutrient;
  // }
}
