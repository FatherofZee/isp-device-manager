import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-technician-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './technician-form.component.html',
  styleUrls: ['./technician-form.component.css']
})
export class TechnicianFormComponent implements OnInit {
  formData: any = {
    requirementFeasibleYes: false,
    requirementFeasibleNo: false,
    warrantyYes: false,
    warrantyNo: false,
    warrantyNA: false,
    recipientDiagnosis: '',
    recipientName: '',
    recipientSignature: '',
    recipientDateReceived: '',
    technicianName: '',
    technicianSignature: '',
    technicianDateReceived: '',
    evaluation: '',
    troubleshooting: '',
    conclusion: '',
    actualDuration: '',
    completionDate: '',
    collectionDate: '',
    customerSignature: ''
  };

  customerSignature: File | null = null;
  techSignature: File | null = null;
  leadSignature: File | null = null;
  submitted = false;
  acceptanceForm: any = null;
  warrantyResult: boolean | null = null;
  technicianForms: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const technicianFormId = params['technicianFormId'];
      if (technicianFormId) {
        this.http.get<any>(`http://localhost:3000/technicianForms/${technicianFormId}`).subscribe(form => {
          this.formData = form;
        });
      }

      const acceptanceId = params['acceptanceId'];
      if (acceptanceId) {
        this.http.get<any>(`http://localhost:3000/acceptanceForms/${acceptanceId}`).subscribe(form => {
          this.acceptanceForm = form;
          // Pre-fill relevant fields
          this.formData.recipientName = form.techName || '';
          this.formData.recipientDateReceived = form.dateTime || '';
          this.formData.recipientDiagnosis = form.diagnosis || '';
          this.formData.technicianName = form.techName || '';
          this.formData.technicianDateReceived = form.dateTime || '';
          this.formData.serialNumber = form.box?.IMEI || '';
          this.formData.phoneNumber = form.customerCell || '';
        });
      }

      if (params['warranty'] === 'yes') {
        this.formData.warrantyYes = true;
      }
    });

    // Load all technician forms for listing
    this.http.get<any[]>('http://localhost:3000/technicianForms').subscribe(forms => {
      this.technicianForms = forms;
    });
  }

  onCustomerSignatureUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.formData.customerSignature = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    this.customerSignature = file;
  }

  onTechSignatureUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.formData.technicianSignature = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    this.techSignature = file;
  }

  onLeadSignatureUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.formData.leadSignature = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    this.leadSignature = file;
  }

  onSubmit() {
    this.http.post<any>('http://localhost:3000/technicianForms', this.formData).subscribe({
      next: (result) => {
        this.submitted = true;
        alert('Form submitted!');
        // Optionally navigate or reset form here
      },
      error: () => alert('Error submitting form!')
    });
  }

  exportToPdf() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('For Internal Use Only', 10, 15);

    doc.setFontSize(11);
    doc.text(`Requirement Feasible: Yes [${this.formData.requirementFeasibleYes ? 'X' : ' '}]  No [${this.formData.requirementFeasibleNo ? 'X' : ' '}]`, 10, 25);
    doc.text(`Device under Warranty: Yes [${this.formData.warrantyYes ? 'X' : ' '}]  No [${this.formData.warrantyNo ? 'X' : ' '}]  N/A [${this.formData.warrantyNA ? 'X' : ' '}]`, 10, 32);

    doc.text('Orange Recipient Diagnosis:', 10, 42);
    doc.text(this.formData.recipientDiagnosis || '', 10, 48);
    doc.text(`Orange Recipient Name: ${this.formData.recipientName}`, 10, 56);
    doc.text(`Orange Recipient Signature: ${this.formData.recipientSignature}`, 110, 56);
    doc.text(`Date Received: ${this.formData.recipientDateReceived}`, 10, 62);

    doc.text('Orange Technician Diagnosis:', 10, 72);
    doc.text(`Support Technician Name: ${this.formData.technicianName}`, 10, 78);
    doc.text(`Support Technician Signature: ${this.formData.technicianSignature}`, 110, 78);
    doc.text(`Date Received: ${this.formData.technicianDateReceived}`, 10, 84);

    doc.text('Evaluation:', 10, 94);
    doc.text(this.formData.evaluation || '', 10, 100);

    doc.text('Troubleshooting measures undertaken:', 10, 110);
    doc.text(this.formData.troubleshooting || '', 10, 116);

    doc.text('Conclusion:', 10, 126);
    doc.text(this.formData.conclusion || '', 10, 132);

    doc.text(`Actual Duration of Troubleshooting: ${this.formData.actualDuration}`, 10, 142);
    doc.text(`Completion Date: ${this.formData.completionDate}`, 10, 148);
    doc.text(`Date of Collection: ${this.formData.collectionDate}`, 10, 154);

    // Add customer signature image if present
    if (this.formData.customerSignature) {
      doc.text('Customer Signature:', 10, 164);
      doc.addImage(this.formData.customerSignature, 'PNG', 60, 158, 40, 15);
    }

    doc.save('technician-form.pdf');
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

  navigateToTechnicianForm(result: any) {
    this.router.navigate(['/technician-form'], { 
      queryParams: { 
        acceptanceId: result.id, 
        warranty: this.warrantyResult ? 'yes' : 'no' 
      } 
    });
  }

  openTechnicianForm(id: number) {
    this.router.navigate(['/technician-form'], { queryParams: { technicianFormId: id } });
  }
}