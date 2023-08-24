import { Component, HostListener, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { SharedService } from 'src/services/sharedService';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';



@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatDividerModule, MatIconModule, MatInputModule, FormsModule, CommonModule, MatRadioModule, MatButtonModule,
    MatStepperModule,
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    FooterComponent],
})
export class CalculatorComponent implements OnInit{

  height: number | any = '';
  weight: number | any = '';
  age: number | any = '';
  gender: string = "";
  activity_level: number | any = '';

  result: number = 0;
  verticalNeeded = false;

  screenWidth: number = window.innerWidth;
  lastScreenSize: number = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 680) {
      if (this.lastScreenSize == 0 || this.lastScreenSize >= 680) {
        this.verticalNeeded = true;
      }
    }
    if (this.screenWidth >= 680) {
      this.verticalNeeded = false;
      this.lastScreenSize = this.screenWidth;

    }
    // Burada ekran genişliği değiştiğinde yapmak istediğiniz işlemleri gerçekleştirebilirsiniz.
  }



  searchValue: string = '';
  onInputChange(): void {
    console.log(this.searchValue);
  }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
  fourthFormGroup = this._formBuilder.group({
    fourthCtrl: ['', Validators.required],
  });
  fifthFormGroup = this._formBuilder.group({
    fifthCtrl: ['', Validators.required],
  });
  isLinear = true;

  theme = "";
  subscription: Subscription;

  constructor(private _formBuilder: FormBuilder, private sharedService: SharedService) {
    this.subscription = this.sharedService.getGlobalTheme().subscribe(value => {
      this.theme = value;
    });
  }
  ngOnInit(): void {
    this.onResize(null);
  }



  onButtonClick() {
    console.log('Girilen Değer:', this.height, this.age, this.gender, this.weight, this.activity_level);
    this.result = 1;

    let activity_factor: number = 0;
    if (this.activity_level == 1) activity_factor = 1.5
    else if (this.activity_level == 2) activity_factor = 1.4
    else if (this.activity_level == 3) activity_factor = 1.3
    else if (this.activity_level == 4) activity_factor = 1.2

    if (this.gender == "Male")
      this.result = (66.5 + 13.75 * this.weight + 5 * this.height - 6.77 * this.age) * activity_factor;
    else
      this.result = (655.1 + 9.56 * this.weight + 1.85 * this.height - 4.67 * this.age) * activity_factor;
    this.result = Math.ceil(this.result);
  }

}
