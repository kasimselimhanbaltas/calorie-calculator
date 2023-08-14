import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [ MatSidenavModule ]
})
export class LandingPageComponent {

  constructor(private router: Router) {}

  CTA() {
    this.router.navigate(["/foods"]);
  }
}
