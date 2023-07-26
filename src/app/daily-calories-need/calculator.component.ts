import { Component } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';



@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatDividerModule, MatIconModule, MatInputModule, FormsModule, CommonModule, MatRadioModule],
})
export class CalculatorComponent {
  
  height: number | any = '';
  weight: number | any = '';
  age: number | any = '';
  gender: string = "";
  activity_level: number | any = '';

  result: number = 0;

  searchValue: string = '';
  onInputChange(): void {
    console.log(this.searchValue);
  }

  onButtonClick() {
    console.log('Girilen Değer:', this.height, this.age, this.gender, this.weight, this.activity_level);
    this.result = 1;
    
    let activity_factor: number = 0;
    if(this.activity_level == 1) activity_factor = 1.5
    else if(this.activity_level == 2) activity_factor = 1.4
    else if(this.activity_level == 3) activity_factor = 1.3
    else if(this.activity_level == 4) activity_factor = 1.2

    if(this.gender == "Male")
      this.result = (66.5 + 13.75*this.weight + 5*this.height - 6.77*this.age) * activity_factor;
    else 
      this.result = (655.1 + 9.56*this.weight + 1.85*this.height - 4.67*this.age) * activity_factor;
    this.result = Math.ceil(this.result);
  }

}
