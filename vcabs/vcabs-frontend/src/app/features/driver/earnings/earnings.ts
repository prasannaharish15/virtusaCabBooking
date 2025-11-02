import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DriverService, HistoryDTO } from '../../../core/services/driver';

export interface EarningItem {
  id: number;
  date: Date;
  amount: number;
  passengerName: string;
  pickupLocation: string;
  dropLocation: string;
  distance: number;
  duration: number;
}

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './earnings.html',
  styleUrls: ['./earnings.css']
})
export class Earnings implements OnInit {
  todayTotal = 0;
  weekTotal = 0;
  monthTotal = 0;
  items: EarningItem[] = [];
  isLoading = true;

  constructor(
    private driverService: DriverService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('💰 Earnings Component Initialized');
    this.loadRideHistory();
  }

  /**
   * Load ride history from backend API
   */
  loadRideHistory(): void {
    console.log('📊 Loading Ride History...');
    this.isLoading = true;
    
    this.driverService.getRideHistory().subscribe({
      next: (history: HistoryDTO[]) => {
        console.log('✅ Ride History Loaded:', history);
        console.log('✅ Total Rides:', history.length);
        
        // Transform backend HistoryDTO to EarningItem
        this.items = history
          .filter(ride => {
            const isCompleted = ride.status === 'COMPLETED';
            const hasCompletedAt = ride.completedAt != null;
            console.log(`🔍 Ride ${ride.rideId}: status=${ride.status}, completedAt=${ride.completedAt}, include=${isCompleted && hasCompletedAt}`);
            return isCompleted && hasCompletedAt;
          })
          .map(ride => ({
            id: ride.rideId,
            date: new Date(ride.completedAt),
            amount: ride.fare,
            passengerName: ride.name,
            pickupLocation: ride.pickUpLocation,
            dropLocation: ride.dropOffLocation,
            distance: ride.distanceKm,
            duration: ride.durationMinutes
          }))
          .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date descending
        
        console.log('✅ Earnings Items:', this.items);
        console.log('✅ Items Length:', this.items.length);
        console.log('✅ Is Loading:', this.isLoading);
        
        if (this.items.length > 0) {
          console.log('✅ First Item:', this.items[0]);
        }
        
        // Calculate totals
        this.calculateTotals();
        this.isLoading = false;
        
        console.log('✅ After setting isLoading to false:', this.isLoading);
        console.log('✅ Items array:', this.items);
        
        // Manually trigger change detection
        this.cdr.detectChanges();
        console.log('✅ Change Detection Triggered');
      },
      error: (err) => {
        console.error('❌ Error loading ride history:', err);
        console.error('❌ Error Status:', err.status);
        console.error('❌ Error Message:', err.message);
        this.isLoading = false;
        
        // Show empty state on error
        this.items = [];
        this.todayTotal = 0;
        this.weekTotal = 0;
        this.monthTotal = 0;
        this.cdr.detectChanges();
      }
    });
  }

  private calculateTotals(): void {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    this.todayTotal = this.items
      .filter(item => item.date >= todayStart)
      .reduce((sum, item) => sum + item.amount, 0);

    this.weekTotal = this.items
      .filter(item => item.date >= weekAgo)
      .reduce((sum, item) => sum + item.amount, 0);

    this.monthTotal = this.items
      .filter(item => item.date >= monthStart)
      .reduce((sum, item) => sum + item.amount, 0);
    
    console.log('✅ Totals Calculated:', {
      today: this.todayTotal,
      week: this.weekTotal,
      month: this.monthTotal
    });
  }
}
