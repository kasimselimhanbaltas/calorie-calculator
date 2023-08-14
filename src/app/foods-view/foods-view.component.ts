import { Component, OnInit, DoCheck, HostListener, ViewChild } from '@angular/core';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';

import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { SharedService } from 'src/services/sharedService';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { EditNutrientComponent } from '../edit-nutrient/edit-nutrient.component';
import { AddNutrientComponent } from '../add-nutrient/add-nutrient.component';
import { Subscription, last } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';

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
  imports: [MatCheckboxModule, CommonModule, FormsModule, MatDividerModule, EditNutrientComponent, AddNutrientComponent, MatPaginatorModule, MatSidenavModule]
})
export class FoodsViewComponent implements OnInit, DoCheck {

  screenWidth: number = window.innerWidth;
  drawerMode: any = "side"

  showCategories = false;

  @ViewChild('drawer') myDrawer!: MatDrawer;
  lastScreenSize: number = 0;
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1200) {
      if(this.lastScreenSize == 0 || this.lastScreenSize >= 1200){
        this.drawerMode = 'over';
        this.myDrawer.close()
        this.showCategories = true;
        this.lastScreenSize = this.screenWidth;
      }
    } 
    if (this.screenWidth >= 1200) {
      this.drawerMode = 'side';
      this.lastScreenSize = this.screenWidth;

    }
    // Burada ekran genişliği değiştiğinde yapmak istediğiniz işlemleri gerçekleştirebilirsiniz.
  }

  toggleCategories() {
    if (!this.showCategories) {
      this.showCategories = true;
      this.decoration1Class = ""
    } else {
      this.showCategories = false;
      this.decoration1Class = "border-0"
    }
    
  }

  decoration1Class = "border-0";

  private userSub: Subscription;
  isAuthenticated = false;
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

  constructor(private sharedService: SharedService, private authService: AuthService) {}

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.updatePFList();

  }

    /**
   * fetchedlist
   * foodsviewing 
   *      sort by category and input
   * filteredFV
   *      pagination
   * P + F
   * 
   * 
   */
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
      this.foodsPF.push(this.filteredFV[i]);
    }

    // if(this.foodsPF.length < this.pageSize) this.pageEvent.pageIndex = 0;
  }
  
  ngDoCheck(): void {
    this.updatePFList()
  }

  async ngOnInit(): Promise<void> {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
    (await this.sharedService.getFoods()).subscribe(foods => {
      this.fetchedFoods = foods;
      this.updatePFList();
    });
    if(window.innerWidth < 1200){
      this.drawerMode = 'over';
      this.myDrawer.close()
      this.showCategories = true;
    }
  }
  firestore: Firestore = inject(Firestore);

  setList() {
    this.sharedService.setList(this.fetchedFoods);
  }

  searchValue: string = '';

  selectFood(item: food, index: number){
    this.sharedService.setSelectedFood(item);
    this.sharedService.setSelectedIndex(index);
  }

}
