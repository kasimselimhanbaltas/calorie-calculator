import { Component, OnInit } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import {food} from "../foods-view/foods-view.component"
import { SharedService } from 'src/services/sharedService';
import { intakeNutrient } from '../calories-intake/calories-intake.component';



@Component({
  selector: 'app-calories-intake-modal',
  templateUrl: './calories-intake-modal.component.html',
  styleUrls: ['./calories-intake-modal.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatDividerModule, MatIconModule, MatInputModule, FormsModule, CommonModule, MatRadioModule],
})
export class CaloriesIntakeModalComponent implements OnInit  {
  food: string = '';
  category: string = '';
  grams: number | any = '';
  calories: number | any = '';
  carbs: number | any = '';
  fat: number | any = '';
  protein: number | any = '';
  imageURL: string | any = '';

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
  selectedFood: food;
  constructor(private sharedService: SharedService) {}
  ngOnInit(): void {
    this.sharedService.getSelectedFood().subscribe(food => {
      this.selectedFood = food;
      console.log(this.selectedFood);
    });
  }
  addToIntakeNutrientsList(food) {
    console.log("modal//")
    let caloriesPerGram: number = (food.Calories / food.Grams);
    let newNutirentToSave: intakeNutrient = {
      Food: food.Food,
      Grams: this.grams,
      CaloriesPerGram: Math.round( caloriesPerGram * 1e2 ) / 1e2,
      imageURL: food.imageURL
    }
    this.sharedService.addToIntakeNutrients(newNutirentToSave)
    // this.grams = null;
  }

  // addNutrient() {
  //   let objToInsert: food = {
  //     ID: "",
  //     Calories: this.calories,
  //     Category: this.category,
  //     Carbs: this.carbs,
  //     Fat: this.fat,
  //     Food: this.food,
  //     Grams: this.grams,
  //     Protein: this.protein,
  //     imageURL: this.imageURL
  //   }
  // }
}
