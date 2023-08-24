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
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { MatInputModule } from '@angular/material/input';
import { FooterComponent } from './footer/footer.component';

// const routes: Routes = [
//   { path: 'landing-page', component: LandingPageComponent },
//   { path: 'daily-calories-need', component: CalculatorComponent }, 
//   { path: 'calories-intake', component: CaloriesIntakeComponent, canActivate: [AuthGuard] },
//   { path: 'foods', component: FoodsViewComponent },
//   { path: 'login-register', component: AuthComponent },
// ];
const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'daily-calories-need', component: CalculatorComponent }, 
  { path: 'calories-intake', component: CaloriesIntakeComponent, canActivate: [AuthGuard] },
  { path: 'foods', component: FoodsViewComponent },
  { path: 'login-register', component: AuthComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
  ],
  imports: [
    ThemeToggleComponent,
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
    MatInputModule,
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
