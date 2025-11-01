import { Injectable } from '@angular/core';
import { Customer } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private currentCustomer: Customer = {
    id: 'customer-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    totalBookings: 0,
    totalSpent: 0,
    memberSince: new Date('2023-01-01'),
    preferences: {
      preferredCabType: '4-seater',
      preferredPaymentMethod: 'UPI'
    }
  };

  getCurrentCustomer(): Customer {
    return this.currentCustomer;
  }

  updateCustomerPreferences(preferences: Partial<Customer['preferences']>): void {
    this.currentCustomer.preferences = {
      ...this.currentCustomer.preferences,
      ...preferences
    };
  }

  updateCustomerStats(totalBookings: number, totalSpent: number): void {
    this.currentCustomer.totalBookings = totalBookings;
    this.currentCustomer.totalSpent = totalSpent;
  }
}


