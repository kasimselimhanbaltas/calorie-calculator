import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [ MatSidenavModule, ThemeToggleComponent ]
})
export class LandingPageComponent {

  constructor(private router: Router) {}

  CTA() {
    this.router.navigate(["/foods"]);
  }
}
