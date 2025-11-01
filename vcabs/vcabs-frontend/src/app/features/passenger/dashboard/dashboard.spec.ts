import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial stats as zero', () => {
    expect(component.stats.totalBookings).toBe(0);
    expect(component.stats.totalSpent).toBe(0);
  });

  it('should have customer defined', () => {
    expect(component.customer).toBeDefined();
  });
});