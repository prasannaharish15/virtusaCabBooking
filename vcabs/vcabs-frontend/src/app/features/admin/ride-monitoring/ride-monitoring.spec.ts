import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideMonitoring } from './ride-monitoring';

describe('RideMonitoring', () => {
  let component: RideMonitoring;
  let fixture: ComponentFixture<RideMonitoring>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideMonitoring]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideMonitoring);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
