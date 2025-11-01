import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntercityBookingComponent } from './intercity-booking.component';

describe('IntercityBookingComponent', () => {
  let component: IntercityBookingComponent;
  let fixture: ComponentFixture<IntercityBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntercityBookingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IntercityBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


