import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  username = '';
  password = '';
  role: 'technician' | 'shop' | '' = '';

  constructor(private router: Router) {}

  onLogin() {
    if (!this.role) {
      alert('Please select a role.');
      return;
    }
    // For demo, just store role and redirect
    localStorage.setItem('userRole', this.role);
    if (this.role === 'shop') {
      this.router.navigate(['/shop-dashboard']);
    } else if (this.role === 'technician') {
      this.router.navigate(['/technician-dashboard']);
    }
  }
}
