import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-warranty-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './warranty-result.component.html',
  styleUrls: ['./warranty-result.component.css']
})
export class WarrantyResultComponent implements OnInit {
  imei: string | null = null;
  receiptDate: string | null = null;
  isWithinWarranty: boolean | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Example: get IMEI from route params
    this.imei = this.route.snapshot.paramMap.get('imei');

    // TODO: Replace with real API call to get receipt info by IMEI
    // For demo, mock a receipt date (e.g., 2025-01-01)
    this.receiptDate = '2025-01-01';

    if (this.receiptDate) {
      const receipt = new Date(this.receiptDate);
      const now = new Date();
      const diffInMs = now.getTime() - receipt.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      this.isWithinWarranty = diffInDays < 365;
    }
  }
}