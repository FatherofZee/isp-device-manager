import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyResultComponent } from './warranty-result.component';

describe('WarrantyResultComponent', () => {
  let component: WarrantyResultComponent;
  let fixture: ComponentFixture<WarrantyResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarrantyResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarrantyResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
