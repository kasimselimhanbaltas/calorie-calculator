import { Component, OnInit} from '@angular/core';
import "../../node_modules/bootstrap/dist/js/bootstrap.min.js"
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/services/sharedService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  theme = "";
  subscription: Subscription;

  constructor(private authService: AuthService, private sharedService: SharedService) {
    this.subscription = this.sharedService.getGlobalTheme().subscribe(value => {
      this.theme = value;
    });
   }  
  ngOnInit(): void {
    this.authService.autologin();
  }
  title = 'calorie-calculator';
  nutrientVar: any;
  // onNutrientDeleted(nutrient: any) {
  //   this.nutrientVar = nutrient;
  // }
}
