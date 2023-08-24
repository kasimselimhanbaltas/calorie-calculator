import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/services/sharedService';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports: [ CommonModule]
})
export class FooterComponent {

  theme = "";
  subscription: Subscription;

  constructor(private sharedService: SharedService) {
    this.subscription = this.sharedService.getGlobalTheme().subscribe(value => {
      this.theme = value;
    });
  }

}
