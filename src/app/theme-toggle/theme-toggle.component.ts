import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // F
@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ThemeToggleComponent {

  isPressed = false;
  isSyncEnabled = false;

  toggleButton(): void {
    this.isPressed = !this.isPressed;
    
    if (this.isSyncEnabled) {
      document.body.setAttribute('data-dark-mode', this.isPressed.toString());
    }
  }

}
