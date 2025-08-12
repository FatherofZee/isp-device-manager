import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  loginForm = {
    cuid: '',
    password: '',
    selectedRole: ''
  };
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.errorMessage = '';
    this.http.get<any[]>('http://localhost:3000/users').subscribe(users => {
      const user = users.find(u =>
        u.cuid === this.loginForm.cuid &&
        u.password === this.loginForm.password &&
        u.role === this.loginForm.selectedRole
      );
      if (user) {
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('cuid', user.cuid);
        if (user.role === 'shop') {
          this.router.navigate(['/shop-dashboard']);
        } else if (user.role === 'technician') {
          this.router.navigate(['/technician-dashboard']);
        }
      } else {
        this.errorMessage = 'Invalid credentials or role selected!';
      }
    }, err => {
      this.errorMessage = 'Unable to connect to server.';
    });
  }
}
