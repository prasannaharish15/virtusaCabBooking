import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusSummary } from './status-summary';

describe('StatusSummary', () => {
  let component: StatusSummary;
  let fixture: ComponentFixture<StatusSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
