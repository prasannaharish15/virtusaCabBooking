import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CancelledRides } from './cancelled-rides';

describe('CancelledRides (Admin)', () => {
  let component: CancelledRides;
  let fixture: ComponentFixture<CancelledRides>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelledRides],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelledRides);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


