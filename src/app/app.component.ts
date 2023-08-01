import { Component, OnInit} from '@angular/core';
import "../../node_modules/bootstrap/dist/js/bootstrap.min.js"
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.autologin();
  }
  title = 'calorie-calculator';
  nutrientVar: any;
  // onNutrientDeleted(nutrient: any) {
  //   this.nutrientVar = nutrient;
  // }
}
