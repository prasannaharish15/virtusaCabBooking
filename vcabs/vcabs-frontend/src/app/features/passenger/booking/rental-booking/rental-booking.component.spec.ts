import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RentalBookingComponent } from './rental-booking.component';

describe('RentalBookingComponent', () => {
  let component: RentalBookingComponent;
  let fixture: ComponentFixture<RentalBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalBookingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RentalBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


