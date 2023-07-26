import {Injectable, inject} from "@angular/core";
import { DocumentData, Firestore, collection, collectionData, query, getDocs, setDoc, doc, getDoc  } from "@angular/fire/firestore";
import { food } from "src/app/foods-view/foods-view.component";
import { Observable, Subject, map, zip } from 'rxjs';

interface footToCalc {
  Calories: number,
  Category: string,
  Food: string,
  Grams: number,

}
@Injectable({
  providedIn: "root",
})
export class SharedService {

  constructor() {};

  firestore: Firestore = inject(Firestore);
  public foodsList: food[] = [];
  private foodsList$: Observable<food[]> | null;
  public selectedIndex: number;


  private selectedFoodSubject = new Subject<food>();
  private selectedIndexSubject = new Subject<number>();
  private foodsListSubject = new Subject<food[]>();
  private selectedFood: food | null = null;

  setSelectedFood(food: food) {
    console.log("service :", food)
    this.selectedFood = food;
    this.selectedFoodSubject.next(food);
    console.log("sfs", this.selectedFoodSubject);
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
    this.foodsList.push(food);
    this.setList(this.foodsList);
  }
  // Updates a single nutrient and updates the cloud
  public updateList(food, index) {
    this.foodsList[index] = food; // Update the edited food in the list
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

