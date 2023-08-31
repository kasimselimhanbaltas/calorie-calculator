import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { AuthResponseData, AuthService } from './auth.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from 'src/services/sharedService';
@Component({
  selector: 'app-auth-component',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatInputModule, FormsModule, CommonModule, MatRadioModule, LoadingSpinnerComponent]
})
export class AuthComponent {

  hide = true;
  email: string;
  password: string;
  confirmEmail: string;

  isLoginMode = true;
  isLoading = false;
  error: string = null;

  inputValue = '';
  sharedValue = '';

  theme = "";
  subscription: Subscription;

  constructor(private authService: AuthService, private router: Router, private sharedService: SharedService) {
    this.subscription = this.sharedService.getGlobalTheme().subscribe(value => {
      this.theme = value;
    });
   }  

  switchLoginMode(mode) {
    if(mode == "login") this.isLoginMode = true;
    else this.isLoginMode = false
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    const email = form.value.email;
    const confirmEmail = form.value.confirmEmail;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      if(email !== confirmEmail) {
        this.error = "E-mail adresses does not match!"
        this.isLoading = false;
        return;
      }
      authObs = this.authService.signup(email, password);
    }
    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(["/calories-intake"]);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
