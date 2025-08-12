import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-acceptance-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './acceptance-form.component.html',
  styleUrls: ['./acceptance-form.component.css']
})
export class AcceptanceFormComponent {
  form: any = {
    makeModel: '',
    box: {
      battery: false,
      charger: false,
      dataCord: false,
      simCard: false,
      mediaCd: false,
      memoryCard: false,
      earphones: false,
      dataBackup: false,
      receiptCopy: false,
      IMEI: '',
      PIN: '',
      password: '',
      securityCode: '',
      others: false
    },
    diagnosis: '',
    email: {
      account: '',
      password: '',
      popimap: '',
      username: ''
    },
    customerName: '',
    customerCell: '',
    techName: '',
    techCell: '',
    altNumber: '',
    dateTime: '',
    estimatedDuration: '',
    customerSignature: '',
    techSignature: ''
  };

  customerSignature: File | null = null;
  techSignature: File | null = null;
  technicianLink: string = '';
  warrantyResult: boolean | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onCustomerSignature(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.customerSignature = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    this.customerSignature = file;
  }

  onTechSignature(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.techSignature = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    this.techSignature = file;
  }

  onSubmit() {
    // Save to mock API (json-server)
    this.http.post<any>('http://localhost:3000/acceptanceForms', this.form).subscribe({
      next: (result) => {
        alert('Form submitted!');
        const role = localStorage.getItem('userRole');
        if (role === 'technician') {
          // Redirect technician to technician form for this acceptance
          this.router.navigate(['/technician-form'], { queryParams: { acceptanceId: result.id } });
        } else {
          // For shop assistant, show link to technician form
          this.technicianLink = `/technician-form?acceptanceId=${result.id}`;
        }
        // Optionally reset form here if desired
      },
      error: () => alert('Error submitting form!')
    });
  }

  backToDashboard() {
    const role = localStorage.getItem('userRole');
    if (role === 'shop') {
      this.router.navigate(['/shop-dashboard']);
    } else if (role === 'technician') {
      this.router.navigate(['/technician-dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  onIMEIBlur() {
    if (this.form.box.IMEI) {
      this.http.get<any>(`http://your-receipt-api/receipts?imei=${this.form.box.IMEI}`).subscribe(receipt => {
        if (receipt && receipt.purchaseDate) {
          const purchaseDate = new Date(receipt.purchaseDate);
          const now = new Date();
          const diffYears = (now.getTime() - purchaseDate.getTime()) / (1000 * 3600 * 24 * 365);
          this.warrantyResult = diffYears < 1;
        } else {
          this.warrantyResult = null;
        }
      });
    }
  }
}