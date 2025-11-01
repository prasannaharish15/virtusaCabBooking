import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideRequests } from './ride-requests';

describe('RideRequests', () => {
  let component: RideRequests;
  let fixture: ComponentFixture<RideRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
