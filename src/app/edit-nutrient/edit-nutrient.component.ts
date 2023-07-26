import { Component, inject, OnInit } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import { Firestore, collectionData, collection, addDoc, and } from '@angular/fire/firestore';
import {food} from "../foods-view/foods-view.component"
import { SharedService } from 'src/services/sharedService';


@Component({
  selector: 'app-edit-nutrient',
  templateUrl: './edit-nutrient.component.html',
  styleUrls: ['./edit-nutrient.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatDividerModule, MatIconModule, MatInputModule, FormsModule, CommonModule, MatRadioModule]
})
export class EditNutrientComponent implements OnInit {

  ngOnInit(): void {
    this.sharedService.getSelectedFood().subscribe(food => {
      this.selectedFood = food;
      console.log("modal :", this.selectedFood)
    });
    this.sharedService.getSelectedIndex().subscribe(index => {
      this.selectedIndex = index;
      console.log("modal index:", this.selectedIndex)
    });
  }
  constructor(public sharedService: SharedService) {}

  food: string = '';
  category: string = '';
  grams: number | any = '';
  calories: number | any = '';
  carbs: number | any = '';
  fat: number | any = '';
  protein: number | any = '';
  imageURL: string | any = ''

  selectedFood: food | null = null;
  selectedIndex: number | null = null; 

  editing: boolean = false;

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

  updateNutrient() {
    this.editing = false;
    this.sharedService.updateList(this.selectedFood, this.selectedIndex)
  }

  deleteNutrient() {
    console.log("deleting: ", this.selectedIndex);
    if(this.selectedIndex >= 0 && this.selectedIndex != null){      
      this.sharedService.deleteFood(this.selectedFood);
      this.editing = false;
    } else {  
      console.log("wtf with index: ", this.selectedIndex);
    }
  }
}
