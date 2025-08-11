import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormApiService } from '../services/form-api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technician-dashboard.component.html',
  styleUrls: ['./technician-dashboard.component.css']
})
export class TechnicianDashboardComponent implements OnInit {
  acceptanceForms: any[] = [];
  technicianForms: any[] = [];

  constructor(private api: FormApiService, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    if (role !== 'technician') {
      this.router.navigate(['/']);
      return;
    }

    // Get all acceptance forms from the DB
    this.api.getAcceptanceForms().subscribe(forms => {
      this.acceptanceForms = forms;
    });

    this.http.get<any[]>('http://localhost:3000/technicianForms').subscribe(forms => {
      this.technicianForms = forms;
    });
  }

  createTechnicianFormBlank() {
    this.router.navigate(['/technician-form']);
  }

  createTechnicianFormFromAcceptance(form: any) {
    this.router.navigate(['/technician-form'], { queryParams: { acceptanceId: form.id } });
  }

  createAcceptanceForm() {
    this.router.navigate(['/acceptance-form']);
  }

  logout() {
    localStorage.removeItem('userRole');
    this.router.navigate(['/']);
  }
}
