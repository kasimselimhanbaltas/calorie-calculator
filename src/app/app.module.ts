import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FoodsViewComponent } from './foods-view/foods-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CalculatorComponent } from './daily-calories-need/calculator.component';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

import { FormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environment';
import { CaloriesIntakeComponent } from './calories-intake/calories-intake.component';
import { CaloriesIntakeModalComponent } from './calories-intake-modal/calories-intake-modal.component';
import { EditNutrientComponent } from './edit-nutrient/edit-nutrient.component';
import { AddNutrientComponent } from './add-nutrient/add-nutrient.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';

// const routes: Routes = [
//   { path: 'landing-page', component: LandingPageComponent },
//   { path: 'daily-calories-need', component: CalculatorComponent }, 
//   { path: 'calories-intake', component: CaloriesIntakeComponent, canActivate: [AuthGuard] },
//   { path: 'foods', component: FoodsViewComponent },
//   { path: 'login-register', component: AuthComponent },
// ];
const routes: Routes = [
  { path: 'calorie-calculator/landing-page', component: LandingPageComponent },
  { path: 'calorie-calculator/daily-calories-need', component: CalculatorComponent }, 
  { path: 'calorie-calculator/calories-intake', component: CaloriesIntakeComponent, canActivate: [AuthGuard] },
  { path: 'calorie-calculator/foods', component: FoodsViewComponent },
  { path: 'calorie-calculator/login-register', component: AuthComponent },
];
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NavbarComponent,
    LandingPageComponent,
    LoadingSpinnerComponent,
    AuthComponent,
    HttpClientModule,
    AddNutrientComponent,
    CalculatorComponent,
    CaloriesIntakeComponent,
    CaloriesIntakeModalComponent,
    FoodsViewComponent,
    EditNutrientComponent,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    FormsModule,
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
  ],
  exports: [
    RouterModule
  ]
  ,
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
