import {Injectable, inject, OnInit} from "@angular/core";
import { Firestore, setDoc, doc, getDoc, collection, collectionData  } from "@angular/fire/firestore";
import { food } from "src/app/foods-view/foods-view.component";
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { intakeNutrient } from "src/app/calories-intake/calories-intake.component";
import { AuthService } from "src/app/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class SharedService implements OnInit {
  getThemeFromLocalStorage(): string | any {
    this.theme = localStorage.getItem('theme');
    console.log("****", localStorage.getItem('theme'))
    if (!this.theme) {
      console.log("**/*/11,", this.theme, localStorage.getItem('theme'))
      this.theme = "light";
      this.setThemeToLocalStorage('light');
    }
    this.setGlobalTheme(this.theme);
  }
  setThemeToLocalStorage(theme: string) {
    localStorage.setItem('theme', theme)
  }

  constructor(private authService: AuthService) { 
    this.getThemeFromLocalStorage();
  }
  theme = null;

  ngOnInit(): void {
  }
;

  firestore: Firestore = inject(Firestore);
  public foodsList: food[] = [];
  private foodsList$: Observable<food[]> | null;
  public selectedIndex: number;
  public intakeNutrients: intakeNutrient[] = [];

  private selectedFoodSubject = new Subject<food>();
  private selectedIndexSubject = new Subject<number>();
  private intakeNutrientsSubject = new Subject<intakeNutrient[]>();
  private globalThemeSubject = new BehaviorSubject<string>("light");

  
  getGlobalTheme(): Observable<string> {
    return this.globalThemeSubject.asObservable();
  }
  setGlobalTheme(theme) {
    this.setThemeToLocalStorage(theme);
    this.globalThemeSubject.next(theme);
  }

  addToIntakeNutrients(intakeNutrientI: intakeNutrient) {
    console.log("adding: ", intakeNutrientI)
    this.intakeNutrients.push(intakeNutrientI);
    console.log("list: ", this.intakeNutrients)
    this.intakeNutrientsSubject.next(this.intakeNutrients);
  }
  deleteFromIntakeNutrients(index: number) {
    this.intakeNutrients.splice(index, 1);
    this.intakeNutrientsSubject.next(this.intakeNutrients);
  }
  getIntakeNutrients(): Observable<intakeNutrient[]> {
    return this.intakeNutrientsSubject.asObservable();
  }

  setSelectedFood(food: food) {
    console.log("service :", food)
    this.selectedFoodSubject.next(food);
  }

  getSelectedFood(): Observable<food> {
    return this.selectedFoodSubject.asObservable();
  }

  setSelectedIndex(index: number) {
    this.selectedIndex = index;
    this.selectedIndexSubject.next(index);
  }

  // Returns the selected nutirent's index number as observable
  getSelectedIndex(): Observable<number> {
    return this.selectedIndexSubject.asObservable();
  }
  // Deletes a single nutrient from list and updates the cloud
  public deleteFood(food: food) {
    let index = this.foodsList.indexOf(food);
    console.log("check the index of: ", index)
    console.log(this.foodsList[index], this.foodsList)
    this.foodsList.splice(index, 1);
    this.setList(this.foodsList);
  }

  // Adds a single nutirent to list and updates the cloud
  public insertFood(food: food) {
    //this.authService.user.pipe(take(1), )
    this.foodsList.push(food);
    this.setList(this.foodsList);
  }
  // Updates a single nutrient and updates the cloud
  public updateList(food) {
    let foodIndex: number = null;
    for (let index = 0; index < this.foodsList.length; index++){
      if(food.Food == this.foodsList[index].Food) {
        foodIndex = index;
        break;
      }
    }
    if(foodIndex == null) {
      return;
    }
    this.foodsList[foodIndex] = food; // Update the edited food in the list
    this.setList(this.foodsList); // Update the cloud
  }

  // Updates entire nutrient list
  public setList(foods) {
    setDoc(doc(this.firestore, "nutrients", "list"), {foods})
  }

// Fetches entire nutrients list as food[]
   public async getFoods(): Promise<Observable<food[]>> {
     if (this.foodsList.length !== 0) {
       console.log("Foods already fetched!")
       return new Observable<food[]>(observer => {
         observer.next(this.foodsList);
         observer.complete();
       });
     }
     console.log("First fetch from service");
     if (!this.foodsList$) {
       const docRef = doc(this.firestore, 'nutrients', 'list');
       const docSnap = await getDoc(docRef);
       this.foodsList = (await docSnap).data()["foods"];
       this.foodsList$ = new Observable<food[]>(observer => {
         observer.next(this.foodsList);
         observer.complete();
       });
     }
     return this.foodsList$;
   }
 }
// public getFoods(): Observable<food[]> {
//   if (this.foodsList.length !== 0) {
//     console.log("foods already fetched!")
//     return new Observable<food[]>(observer => {
//       observer.next(this.foodsList);
//       observer.complete();
//     });
//   }
//   console.log("first fetch from service");
//   if (!this.foodsList$) {
//     const collectionInstance = collection(this.firestore, 'foods');
//     this.foodsList$ = collectionData(collectionInstance) as Observable<food[]>;
//     this.foodsList$.subscribe(val => {
//       this.foodsList = val;
//       let foods = val;
//       setDoc(doc(this.firestore, "nutrients", "list"), {foods});
//       console.log("asd", val);
//     });
//   }
//   return this.foodsList$;
// }}


