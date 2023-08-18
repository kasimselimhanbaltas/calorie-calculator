import { Component, ViewChild, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import { food } from "../foods-view/foods-view.component"
import { SharedService } from 'src/services/sharedService';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-add-nutrient',
  templateUrl: './add-nutrient.component.html',
  styleUrls: ['./add-nutrient.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatDividerModule, MatIconModule, MatInputModule, FormsModule, CommonModule, MatRadioModule],
})
export class AddNutrientComponent {
  food: string = '';
  category: string = '';
  grams: number | any = '';
  calories: number | any = '';
  carbs: number | any = '';
  fat: number | any = '';
  protein: number | any = '';
  imageURL: string | any = ''

  firestore: Firestore = inject(Firestore);
  baseCategories: Array<string> = [
    "Meat, Poultry",
    "Breads, cereals, fastfood,grains",
    "Drinks,Alcohol, Beverages",
    "Desserts, sweets",
    "Vegetables A-E",
    "Vegetables F-P",
    "Vegetables R-Z",
    "Fruits A-F",
    "Fruits G-P",
    "Fruits R-Z",
    "Fish, Seafood",
    "Seeds and Nuts",
    "Dairy products",
    "Jams, Jellies",
    "Fats, Oils, Shortenings",
    "Soups"
  ]

  warningClass = "";
  warningActive = false;

  updateWarningClass() {
    //if (this.isAuthenticated) return;
    if (!this.warningActive) {
      this.warningClass = "warning"
      this.warningActive = true;
      setTimeout(() => {
        this.warningClass = "";
        this.warningActive = false
      }, 3000);
    }
  }
  
  @ViewChild('closebutton') closebutton;

  public hideChildModal(): void {
    this.closebutton.nativeElement.click();
  }

  theme = "";
  subscription: Subscription;

  constructor(private sharedService: SharedService) {
    this.subscription = this.sharedService.getGlobalTheme().subscribe(value => {
      this.theme = value;
    });
  }
  addNutrient() {
    let objToInsert: food = {
      Food: this.food,
      Category: this.category,
      Grams: this.grams,
      Calories: this.calories,
      Carbs: this.carbs,
      Fat: this.fat,
      Protein: this.protein,
      imageURL: this.imageURL
    }
    for (const key in objToInsert) {
      if (objToInsert.hasOwnProperty(key)) {
        const value = objToInsert[key];
        if (value === null || value === '') {
          this.updateWarningClass()
          return;
        }
      }
    }
    this.sharedService.insertFood(objToInsert);
    this.hideChildModal();
  }

}
