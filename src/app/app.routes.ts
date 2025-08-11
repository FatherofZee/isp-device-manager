import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page.component';
import { ScanPageComponent } from './pages/scan-page.component';
import { WarrantyResultComponent } from './pages/warranty-result.component';
import { AcceptanceFormComponent } from './pages/acceptance-form.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    data: { renderMode: 'client' }
  },
  {
    path: 'shop-dashboard',
    loadComponent: () =>
      import('./pages/shop-dashboard.component').then(
        (m) => m.ShopDashboardComponent
      ),
    data: { renderMode: 'client' }
  },
  {
    path: 'technician-dashboard',
    loadComponent: () =>
      import('./pages/technician-dashboard.component').then(
        (m) => m.TechnicianDashboardComponent
      ),
    data: { renderMode: 'client' }
  },
  {
    path: 'scan',
    component: ScanPageComponent,
    data: { renderMode: 'client' }
  },
  {
    path: 'result/:imei',
    component: WarrantyResultComponent,
    data: { renderMode: 'client' }
  },
  {
    path: 'technician-form',
    loadComponent: () =>
      import('./pages/technician-form.component').then(
        (m) => m.TechnicianFormComponent
      ),
    data: { renderMode: 'client' }
  },
  {
    path: 'acceptance-form',
    loadComponent: () =>
      import('./pages/acceptance-form.component').then(
        (m) => m.AcceptanceFormComponent
      ),
    data: { renderMode: 'client' }
  }
];
