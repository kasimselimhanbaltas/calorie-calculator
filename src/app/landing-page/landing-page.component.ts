import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [ MatSidenavModule ]
})
export class LandingPageComponent {

}
