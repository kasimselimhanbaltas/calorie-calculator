import { Component, OnInit, DoCheck } from '@angular/core';

import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { SharedService } from 'src/services/sharedService';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { EditNutrientComponent } from '../edit-nutrient/edit-nutrient.component';
import { AddNutrientComponent } from '../add-nutrient/add-nutrient.component';
import { food } from '../foods-view/foods-view.component';
import { NgOptimizedImage } from '@angular/common'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface intakeNutrient {
  Food: string,
  Grams: number,
  CaloriesPerGram: number,
  imageURL: string
}

@Component({
  selector: 'app-calories-intake',
  templateUrl: './calories-intake.component.html',
  styleUrls: ['./calories-intake.component.css'],
  standalone: true,
  imports: [MatCheckboxModule, CommonModule, FormsModule, MatDividerModule, EditNutrientComponent, AddNutrientComponent, NgOptimizedImage, MatPaginatorModule]
})
export class CaloriesIntakeComponent implements OnInit, DoCheck {

  fetchedFoods: food[] | any = [];
  foodsViewing: food[] = [];
  filteredFV: food[] = [];
  foodsPF: food[] = []; // paginated and filtered

  intakeNutrients: intakeNutrient[] = [];

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
  searchValue: string = '';

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent;

  constructor(private sharedService: SharedService, private authService: AuthService) { }


  handlePageEvent(e: PageEvent) {
    console.log("current page: ", e.pageIndex)
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.updatePFList();
  }

    
  updatePFList() {
    // Copy original list
    this.foodsViewing = this.fetchedFoods;
    // Filter by selected categories and search input
    this.foodsViewing = [];
    let checkCheck = true;
    for (const category in this.selectedCategories) {// Check if no categories selected
      if (this.selectedCategories[category]){ 
        checkCheck = false; // At least 1 category selected
      }
    }
    if(checkCheck){ // show all categories
      this.foodsViewing = this.fetchedFoods;
    } else {
      console.log("selected category detected!!  ");  
      for (const category in this.selectedCategories) {
        if (this.selectedCategories[category]) {
          // Filter the fetchedFoods list based on the selected category
          const filteredItems = this.fetchedFoods.filter((foodItem) => foodItem.Category === category);
  
          // Concatenate the filtered items to the existing list
          this.foodsViewing = this.foodsViewing.concat(filteredItems);
        }
      }
    } // foodsViewing filtered by categories at this point
    this.filteredFV = this.foodsViewing.filter(item => item.Food.toLowerCase().includes(this.searchValue.toLowerCase()));
    this.filteredFV.sort((a, b) => a.Food.localeCompare(b.Food));
    // filteredFV is filtered by categories and input at this point

    // Pagination
    this.foodsPF = []
    for (let i = this.pageIndex*this.pageSize; i < (this.pageIndex+1)*this.pageSize; i++) {
      console.log(i)
      this.foodsPF.push(this.filteredFV[i]);
    }
    console.log("aanan", this.foodsPF);
    console.log("aanan", this.filteredFV.length);

    // if(this.foodsPF.length < this.pageSize) this.pageEvent.pageIndex = 0;
  }
  
  ngDoCheck(): void {
    this.updatePFList()
  }

  deleteSavedNutrient(index) {
    console.log("delete: ", index)
    this.sharedService.deleteFromIntakeNutrients(index);
  }
  getTotalCalories(): number {
    return this.intakeNutrients.reduce((total, nutrient) => {
      return total + nutrient.Grams * nutrient.CaloriesPerGram;
    }, 0);
  }

  isAuthenticated = false;
  private userSub: Subscription;

  async ngOnInit(): Promise<void> {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
    (await this.sharedService.getFoods()).subscribe(foods => {
      this.fetchedFoods = foods;
      this.updatePFList();
    });
    (await this.sharedService.getIntakeNutrients()).subscribe(intakeNutrients => {
      this.intakeNutrients = intakeNutrients;
    });
    
  }
  firestore: Firestore = inject(Firestore);

  setList() {
    this.sharedService.setList(this.fetchedFoods);
  }


  selectFood(item: food, index: number){
    this.sharedService.setSelectedFood(item);
    this.sharedService.setSelectedIndex(index);
  }

}

