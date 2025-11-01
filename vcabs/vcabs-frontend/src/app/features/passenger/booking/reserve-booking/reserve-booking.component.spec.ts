import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReserveBookingComponent } from './reserve-booking.component';

describe('ReserveBookingComponent', () => {
  let component: ReserveBookingComponent;
  let fixture: ComponentFixture<ReserveBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReserveBookingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ReserveBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


