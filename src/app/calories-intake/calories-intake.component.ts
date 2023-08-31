import { Component, OnInit, DoCheck, ViewChild, HostListener } from '@angular/core';

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
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ModalDirective } from 'ngx-bootstrap/modal';

export interface intakeNutrient {
  Food: string,
  Grams: number,
  CaloriesPerGram: number,
  imageURL: string,
  CarbsPerGram: number,
  FatPerGram: number,
  ProteinPerGram: number,
}

@Component({
  selector: 'app-calories-intake',
  templateUrl: './calories-intake.component.html',
  styleUrls: ['./calories-intake.component.css'],
  standalone: true,
  imports: [MatCheckboxModule, CommonModule, FormsModule, MatDividerModule, EditNutrientComponent, AddNutrientComponent, NgOptimizedImage, MatPaginatorModule, MatPaginatorModule, MatSidenavModule]
})
export class CaloriesIntakeComponent implements OnInit, DoCheck {

  fetchedFoods: food[] | any = [];
  foodsViewing: food[] = [];
  filteredFV: food[] = [];
  foodsPF: food[] = []; // paginated and filtered

  screenWidth: number = window.innerWidth;
  drawerMode: any = "side"
  showCategories = false;
  showNutrients = false;
  decoration1Class = "border-0";
  decoration2Class = "border-0";
  paginatorClass = "";

  @ViewChild('drawer') myDrawer!: MatDrawer;
  @ViewChild('drawer2') myDrawer2!: MatDrawer;
  @ViewChild('mainDiv') mainDiv!: HTMLElement;
  @ViewChild('decoration1') decoration1!: HTMLElement;
  @ViewChild('decoration2') decoration2!: HTMLElement;

  lastScreenSize: number = 0;
  intakeNutrients: intakeNutrient[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.mainDiv.offsetWidth < 1000) {
      console.log("aaaa")
    }
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1200) {
      if (this.lastScreenSize == 0 || this.lastScreenSize >= 1200) {
        this.drawerMode = 'over';
        this.myDrawer.close()
        this.showCategories = true;
        this.myDrawer2.close()
        this.showNutrients = true;
        this.decoration1Class = "";
        this.decoration2Class = "";
        this.lastScreenSize = this.screenWidth;
      }
    }
    if (this.screenWidth >= 1200) {
      this.drawerMode = 'side';
      this.lastScreenSize = this.screenWidth;
    }
    this.paginatorClass = "paginatorstate";
    // Burada ekran genişliği değiştiğinde yapmak istediğiniz işlemleri gerçekleştirebilirsiniz.
  }
  toggleCategories() {
    if (!this.showCategories) {
      console.log("toggling")
      this.showCategories = true;
      this.decoration1Class = "";
    } else {
      this.showCategories = false;
      this.decoration1Class = "border-0";

    }
  }

  toggleSelectedNutrients() {
    if (!this.showNutrients) {
      this.showNutrients = true;
      this.decoration2Class = "";
    } else {
      this.showNutrients = false;
      this.decoration2Class = "border-0";
    }
  }


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

  theme = "";
  subscription: Subscription;

  constructor(private sharedService: SharedService, private authService: AuthService) {
    this.subscription = this.sharedService.getGlobalTheme().subscribe(value => {
      this.theme = value;
    });
    this.sharedService.getIntakeNutrients().subscribe(intakeNutrients => {
      this.intakeNutrients = intakeNutrients;
    });
  }




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
      if (this.selectedCategories[category]) {
        checkCheck = false; // At least 1 category selected
      }
    }
    if (checkCheck) { // show all categories
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
    for (let i = this.pageIndex * this.pageSize; i < (this.pageIndex + 1) * this.pageSize; i++) {
      if (this.filteredFV[i] == undefined) continue
      this.foodsPF.push(this.filteredFV[i]);
    }

    // if(this.foodsPF.length < this.pageSize) this.pageEvent.pageIndex = 0;
  }

  ngDoCheck(): void {
    if(!this.showCategories && !this.showNutrients) {
      this.paginatorClass = "paginator-state"
    } else {
      this.paginatorClass = "";
    }
    console.log(this.intakeNutrients)
    this.updatePFList()
  
  }

  deleteSavedNutrient(index) {
    console.log("delete: ", index)
    this.sharedService.deleteFromIntakeNutrients(index);
  } 
  getTotalCalories(): any {
    let total: any = {
      calories: 0,
      carbs: 0,
      fats: 0,
      proteins: 0
    }
    total.calories = this.intakeNutrients.reduce((total, nutrient) => {
      return total + nutrient.Grams * nutrient.CaloriesPerGram;
    }, 0);
    total.carbs = this.intakeNutrients.reduce((total, nutrient) => {
      return total + nutrient.Grams * nutrient.CarbsPerGram;
    }, 0);
    total.fats = this.intakeNutrients.reduce((total, nutrient) => {
      return total + nutrient.Grams * nutrient.FatPerGram;
    }, 0);
    total.proteins = this.intakeNutrients.reduce((total, nutrient) => {
      return total + nutrient.Grams * nutrient.ProteinPerGram;
    }, 0);
    return total;
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
    if (window.innerWidth < 1200) {
      this.drawerMode = 'over';
      this.myDrawer.close()
      this.myDrawer2.close()
      this.showCategories = true;
      this.showNutrients = true;
      this.decoration1Class = "";
      this.decoration2Class = "";
    }

  }
  firestore: Firestore = inject(Firestore);

  setList() {
    this.sharedService.setList(this.fetchedFoods);
  }


  selectFood(item: food, index: number) {
    this.sharedService.setSelectedFood(item);
    this.sharedService.setSelectedIndex(index);
  }

}

