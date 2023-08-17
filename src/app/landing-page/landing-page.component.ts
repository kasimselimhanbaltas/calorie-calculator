import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { AuthService } from '../auth/auth.service';
import { SharedService } from 'src/services/sharedService';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [ MatSidenavModule, ThemeToggleComponent, CommonModule ]
})
export class LandingPageComponent {

  theme = "";
  subscription: Subscription;

  constructor(private sharedService: SharedService, private authService: AuthService, private router: Router) {
    this.subscription = this.sharedService.getGlobalTheme().subscribe(value => {
      this.theme = value;
    });
  }

  CTA() {
    this.router.navigate(["/foods"]);
  }
}
