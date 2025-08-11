import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Acceptance Forms
  getAcceptanceForms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/acceptanceForms`);
  }

  getAcceptanceFormById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/acceptanceForms/${id}`);
  }

  addAcceptanceForm(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/acceptanceForms`, form);
  }

  // Technician Forms
  getTechnicianForms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/technicianForms`);
  }

  getTechnicianFormById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/technicianForms/${id}`);
  }

  addTechnicianForm(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/technicianForms`, form);
  }
}