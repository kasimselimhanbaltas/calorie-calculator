import { Component, OnInit } from '@angular/core';
//import { getFoods } from '../../firebase/firebase';

import { inject } from '@angular/core';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import { SharedService } from 'src/services/sharedService';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { EditNutrientComponent } from '../edit-nutrient/edit-nutrient.component';
import { AddNutrientComponent } from '../add-nutrient/add-nutrient.component';

export interface food {
  Food: string,
  Category: string,
  Calories: number,
  Grams: number,
  Carbs: number,
  Fat: number,
  Protein: number,
  imageURL: string
}

@Component({
  selector: 'app-foods-view',
  templateUrl: './foods-view.component.html',
  styleUrls: ['./foods-view.component.css'],
  standalone: true,
  imports: [MatCheckboxModule, CommonModule, FormsModule, MatDividerModule, EditNutrientComponent, AddNutrientComponent]
})
export class FoodsViewComponent implements OnInit {

  fetchedFoods: food[] | any = [];
  foodsViewing: food[] = [];
  filteredFV: food[] = [];
  editModal = document.getElementById('editModal');

  selectedCategories: { [category: string]: boolean } = {};
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
  async ngOnInit(): Promise<void> {
    (await this.sharedService.getFoods()).subscribe(foods => {
      this.fetchedFoods = foods;
      this.foodsViewing = this.fetchedFoods;
      console.log("lennnnn: ", this.fetchedFoods.length)
      this.filteredFV = this.foodsViewing;
    });
  }
  firestore: Firestore = inject(Firestore);

  setList() {
    this.sharedService.setList(this.fetchedFoods);
  }

  constructor(private sharedService: SharedService) {
  }
  searchValue: string = '';
  onInputChange(): void {
    this.filteredFV = this.foodsViewing.filter(item => item.Food.toLowerCase().includes(this.searchValue.toLowerCase()));
  }
  get sortedFoodsViewing(): food[] {
    return this.foodsViewing.sort((a, b) => a.Food.localeCompare(b.Food));
  }
  selectFood(item: food, index: number){
    this.sharedService.setSelectedFood(item);
    this.sharedService.setSelectedIndex(index);
  }

  filterByCategory() {
    this.foodsViewing = [];
    let checkCheck = true;
    for (const category in this.selectedCategories) {
      if (this.selectedCategories[category]){ // check if no categories selected
        checkCheck = false;
      }
    }
    if(checkCheck){
      this.foodsViewing = this.fetchedFoods;
      this.filteredFV = this.foodsViewing;
      this.onInputChange();
      return;
    }
    for (const category in this.selectedCategories) {
      if (this.selectedCategories[category]) {
        // Filter the fetchedFoods list based on the selected category
        const filteredItems = this.fetchedFoods.filter((foodItem) => foodItem.Category === category);

        // Concatenate the filtered items to the existing list
        this.foodsViewing = this.foodsViewing.concat(filteredItems);
      }
    }
    this.filteredFV = this.foodsViewing;
    this.onInputChange();
  }
}
