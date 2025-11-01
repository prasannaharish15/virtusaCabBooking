import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-availability-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './availability-toggle.html',
  styleUrls: ['./availability-toggle.css']
})
export class AvailabilityToggleComponent {
 @Input() isAvailable: boolean = false;
@Output() isAvailableChange = new EventEmitter<boolean>();

toggleStatus() {
  this.isAvailable = !this.isAvailable;
  this.isAvailableChange.emit(this.isAvailable);
}

}
