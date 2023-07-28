import { Component, OnInit, DoCheck} from '@angular/core';
//import { getFoods } from '../../firebase/firebase';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';

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
  imports: [MatCheckboxModule, CommonModule, FormsModule, MatDividerModule, EditNutrientComponent, AddNutrientComponent, MatPaginatorModule]
})
export class FoodsViewComponent implements OnInit, DoCheck {

  fetchedFoods: food[] | any = [];
  foodsViewing: food[] = [];
  filteredFV: food[] = [];
  foodsPF: food[] = []; // paginated and filtered

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent;

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

  handlePageEvent(e: PageEvent) {
    console.log("current page: ", e.pageIndex)
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.updatePFList();

  }
  updatePFList() {
    this.foodsViewing = this.fetchedFoods;
    this.filteredFV = this.foodsViewing;
    this.onInputChange();
    this.foodsPF = []
    for (let i = this.pageIndex*this.pageSize; i < (this.pageIndex+1)*this.pageSize; i++) {
      console.log(i)
      this.foodsPF.push(this.fetchedFoods[i]);
    }
  }
  
  ngDoCheck(): void {
    this.foodsViewing = this.fetchedFoods;
    this.filteredFV = this.foodsViewing;
    this.onInputChange();
  }

  async ngOnInit(): Promise<void> {
    (await this.sharedService.getFoods()).subscribe(foods => {
      this.fetchedFoods = foods;
      this.updatePFList();

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
    console.log("fvlen", this.foodsViewing.length)
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
