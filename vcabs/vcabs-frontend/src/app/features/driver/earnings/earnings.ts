import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverRidesStore, EarningItem } from '../shared/driver-rides.store';

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './earnings.html',
  styleUrls: ['./earnings.css']
})
export class Earnings {
  todayTotal = 0;
  items: EarningItem[] = [];

  constructor(private ridesStore: DriverRidesStore) {
    this.ridesStore.observeStats().subscribe(s => {
      this.todayTotal = s.today.earnings;
    });
    this.ridesStore.observeEarnings().subscribe(list => {
      this.items = list;
    });
  }
}
