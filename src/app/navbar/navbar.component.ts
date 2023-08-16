import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Router } from '@angular/router'; // CLI imports router
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MatSlideToggleModule,
  _MatSlideToggleRequiredValidatorModule,
} from '@angular/material/slide-toggle';
import { SharedService } from 'src/services/sharedService';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [MatDividerModule, CommonModule, RouterModule, ThemeToggleComponent,    MatSlideToggleModule,
    FormsModule,
    _MatSlideToggleRequiredValidatorModule,
    MatButtonModule,
    ReactiveFormsModule,]
})
export class NavbarComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  private userSub: Subscription;
  warningClass = "";
  warningActive = false;

  updateWarningClass() {
    if (this.isAuthenticated) return;
    if (!this.warningActive) {
      console.log("warningA: ", this.warningActive)
      this.warningClass = "warning"
      this.warningActive = true;
      setTimeout(() => {
        this.warningClass = "";
        this.warningActive = false
      }, 3000);
    }
  }
  constructor(private authService: AuthService, private router: Router, private sharedService: SharedService) { }

  themeToggle = true;
  
  updateTheme() {
    if(this.themeToggle)
      this.sharedService.setGlobalTheme("dark");
    else
      this.sharedService.setGlobalTheme("light");
  }
  customRoute(path: string) {
    this.router.navigate([path]);
  }
  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      console.log(!user);
      console.log(!!user);
    });
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
  logOut() {
    this.authService.logout()
  }
}
