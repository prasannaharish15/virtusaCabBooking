import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auditlog } from './auditlog';
import { By } from '@angular/platform-browser';

describe('Auditlog', () => {
  let component: Auditlog;
  let fixture: ComponentFixture<Auditlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Auditlog],
    }).compileComponents();

    fixture = TestBed.createComponent(Auditlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render table rows based on auditLogs', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(component.auditLogs.length);
  });
});





