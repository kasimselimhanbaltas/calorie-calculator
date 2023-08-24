import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { AuthService } from '../auth/auth.service';
import { SharedService } from 'src/services/sharedService';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [ MatSidenavModule, ThemeToggleComponent, CommonModule, FooterComponent, RouterModule ]
})
export class LandingPageComponent {

  private userSub: Subscription;

  theme = "";
  subscription: Subscription;

  constructor(private sharedService: SharedService, private authService: AuthService, private router: Router) {
    this.subscription = this.sharedService.getGlobalTheme().subscribe(value => {
      this.theme = value;
    });
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  CTA() {
    this.router.navigate(["/foods"]);
  }

  isAuthenticated = false;
  warningClass = "";
  warningActive = false;

  updateWarningClass() {
    if (this.isAuthenticated) return;
    if (!this.warningActive) {
      this.warningClass = "warning"
      this.warningActive = true;
      setTimeout(() => {
        this.warningClass = "";
        this.warningActive = false
      }, 3000);
    }
  }
}
