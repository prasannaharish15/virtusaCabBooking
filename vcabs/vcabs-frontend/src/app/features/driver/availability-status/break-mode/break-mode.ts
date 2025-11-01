import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-break-mode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './break-mode.html',
  styleUrls: ['./break-mode.css']
})
export class BreakModeComponent {
  @Input() isOnBreak: boolean = false;
  @Input() breakReason: string = '';
  @Output() BreakMode = new EventEmitter<{ isOnBreak: boolean, breakReason: string }>();

  breakReasons = [
    'Meal Break',
    'Rest',
    'Refueling',
    'Personal',
    'Other'
  ];

  startBreak() {
    this.isOnBreak = true;
    this.BreakMode.emit({ isOnBreak: this.isOnBreak, breakReason: this.breakReason });
  }

  endBreak() {
    this.isOnBreak = false;
    this.breakReason = '';
    this.BreakMode.emit({ isOnBreak: this.isOnBreak, breakReason: this.breakReason });
  }
}
