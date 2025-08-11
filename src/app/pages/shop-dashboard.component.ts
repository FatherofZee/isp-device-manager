import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormApiService } from '../services/form-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-dashboard.component.html',
  styleUrls: ['./shop-dashboard.component.css']
})
export class ShopDashboardComponent implements OnInit {
  acceptanceForms: any[] = [];
  recommendations: any[] = [];

  constructor(private api: FormApiService, private router: Router) {}

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    if (role !== 'shop') {
      this.router.navigate(['/']);
      return;
    }

    this.api.getAcceptanceForms().subscribe(forms => this.acceptanceForms = forms);
    this.api.getTechnicianForms().subscribe(forms => {
      // Filter for signed and recommended forms
      this.recommendations = forms.filter(f => f.leadSignature && f.conclusion);
    });
  }

  createAcceptanceForm() {
    this.router.navigate(['/acceptance-form']);
  }

  viewAcceptanceForm(id: number) {
    this.router.navigate(['/acceptance-form'], { queryParams: { id } });
  }

  logout() {
    localStorage.removeItem('userRole');
    this.router.navigate(['/']);
  }
}
