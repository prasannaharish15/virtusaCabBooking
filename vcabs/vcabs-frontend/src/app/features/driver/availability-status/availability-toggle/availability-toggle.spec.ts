import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityToggle } from './availability-toggle';

describe('AvailabilityToggle', () => {
  let component: AvailabilityToggle;
  let fixture: ComponentFixture<AvailabilityToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityToggle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabilityToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
