import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface AuditLogEntry {
  timestamp: string;
  actorType: 'Admin' | 'Driver' | 'Customer';
  actorName: string;
  action: string;
  entity: string;
  details: string;
  status: 'Success' | 'Failed';
  ipAddress: string;
}

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auditlog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auditlog.html',
})
export class Auditlog implements OnInit {
  auditLogs: AuditLogEntry[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Generate 50+ mock rows
    this.auditLogs = [];

    const actors = [
      { type: 'Admin', name: 'Alice' },
      { type: 'Admin', name: 'Bob' },
      { type: 'Driver', name: 'Rahul Kumar' },
      { type: 'Driver', name: 'Anita Sharma' },
      { type: 'Customer', name: 'John Doe' },
      { type: 'Customer', name: 'Jane Smith' },
      { type: 'Customer', name: 'Ravi Patel' },
    ];

    const actions = [
      { action: 'LOGIN', entity: 'Admin', details: 'Logged in successfully' },
      { action: 'LOGOUT', entity: 'Admin', details: 'Logged out' },
      { action: 'CREATE DRIVER', entity: 'Driver', details: 'Added new driver' },
      { action: 'UPDATE DRIVER', entity: 'Driver', details: 'Updated driver profile' },
      { action: 'BOOK RIDE', entity: 'Ride', details: 'Booked a ride' },
      { action: 'CANCEL RIDE', entity: 'Ride', details: 'Cancelled ride' },
      { action: 'MAKE PAYMENT', entity: 'Billing', details: 'Payment done' },
      { action: 'ACCEPT RIDE', entity: 'Ride', details: 'Accepted ride request' },
      { action: 'COMPLETE RIDE', entity: 'Ride', details: 'Ride completed' },
      { action: 'UPDATE LOCATION', entity: 'Driver', details: 'Location updated' },
      { action: 'RATE DRIVER', entity: 'Driver', details: 'Rated driver 5 stars' },
    ];

    const statuses: ('Success' | 'Failed')[] = ['Success', 'Success', 'Success', 'Failed'];

    for (let i = 0; i < 60; i++) {
      const actor = actors[Math.floor(Math.random() * actors.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const timestamp = new Date(Date.now() - i * 60000) // decrease 1 min per row
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19);

      this.auditLogs.push({
        timestamp,
        actorType: actor.type as 'Admin' | 'Driver' | 'Customer',
        actorName: actor.name,
        action: action.action,
        entity: action.entity,
        details: action.details,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      });
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}

