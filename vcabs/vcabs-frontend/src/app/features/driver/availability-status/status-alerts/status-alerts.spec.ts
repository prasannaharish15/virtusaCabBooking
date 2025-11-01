import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusAlerts } from './status-alerts';

describe('StatusAlerts', () => {
  let component: StatusAlerts;
  let fixture: ComponentFixture<StatusAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusAlerts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusAlerts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
