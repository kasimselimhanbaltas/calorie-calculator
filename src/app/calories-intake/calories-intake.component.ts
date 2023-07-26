import { Component } from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import { CaloriesIntakeModalComponent } from '../calories-intake-modal/calories-intake-modal.component';

@Component({
  selector: 'app-calories-intake',
  templateUrl: './calories-intake.component.html',
  styleUrls: ['./calories-intake.component.css'],
  standalone: true,
  imports: [MatDividerModule, CaloriesIntakeModalComponent],
})
export class CaloriesIntakeComponent {

}
