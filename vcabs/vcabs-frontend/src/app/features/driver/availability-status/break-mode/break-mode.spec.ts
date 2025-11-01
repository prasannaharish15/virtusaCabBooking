import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakMode } from './break-mode';

describe('BreakMode', () => {
  let component: BreakMode;
  let fixture: ComponentFixture<BreakMode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreakMode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreakMode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
