import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedRides } from './completed-rides';

describe('CompletedRides', () => {
  let component: CompletedRides;
  let fixture: ComponentFixture<CompletedRides>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedRides]
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedRides);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

