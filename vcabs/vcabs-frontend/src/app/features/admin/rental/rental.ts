import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

interface RentalRow {
  rentalId: string;
  customerId: string;
  vehicle: string;
  startTime: string; // ISO or readable
  endTime: string;   // ISO or readable
  amount: number;
}

@Component({
  selector: 'app-rental',
  standalone: true,
  imports: [CommonModule, NgFor, CurrencyPipe, DatePipe, RouterModule],
  templateUrl: './rental.html',
  styleUrl: './rental.css'
})
export class Rental {
  rentals: RentalRow[] = [
    { rentalId: 'RNT-9001', customerId: 'CUST-6001', vehicle: 'Sedan - KA 01 AB 1234', startTime: '2025-10-07T09:00:00', endTime: '2025-10-07T12:00:00', amount: 1200 },
    { rentalId: 'RNT-9002', customerId: 'CUST-6002', vehicle: 'Hatchback - MH 12 XY 4567', startTime: '2025-10-07T13:30:00', endTime: '2025-10-07T16:00:00', amount: 900 },
    { rentalId: 'RNT-9003', customerId: 'CUST-6003', vehicle: 'SUV - DL 3C AE 7890', startTime: '2025-10-06T10:00:00', endTime: '2025-10-06T18:00:00', amount: 2400 },
    { rentalId: 'RNT-9004', customerId: 'CUST-6004', vehicle: 'Sedan - TN 10 BC 2345', startTime: '2025-10-05T08:00:00', endTime: '2025-10-05T12:30:00', amount: 1400 },
    { rentalId: 'RNT-9005', customerId: 'CUST-6005', vehicle: 'SUV - TS 07 CD 6789', startTime: '2025-10-05T14:00:00', endTime: '2025-10-05T20:00:00', amount: 2600 },
    { rentalId: 'RNT-9001', customerId: 'CUST-6001', vehicle: 'Sedan - KA 01 AB 1234', startTime: '2025-10-07T09:00:00', endTime: '2025-10-07T12:00:00', amount: 1200 },
    { rentalId: 'RNT-9002', customerId: 'CUST-6002', vehicle: 'Hatchback - MH 12 XY 4567', startTime: '2025-10-07T13:30:00', endTime: '2025-10-07T16:00:00', amount: 900 },
    { rentalId: 'RNT-9003', customerId: 'CUST-6003', vehicle: 'SUV - DL 3C AE 7890', startTime: '2025-10-06T10:00:00', endTime: '2025-10-06T18:00:00', amount: 2400 },
    { rentalId: 'RNT-9004', customerId: 'CUST-6004', vehicle: 'Sedan - TN 10 BC 2345', startTime: '2025-10-05T08:00:00', endTime: '2025-10-05T12:30:00', amount: 1400 },
    { rentalId: 'RNT-9005', customerId: 'CUST-6005', vehicle: 'SUV - TS 07 CD 6789', startTime: '2025-10-05T14:00:00', endTime: '2025-10-05T20:00:00', amount: 2600 },
    { rentalId: 'RNT-9006', customerId: 'CUST-6006', vehicle: 'Hatchback - KA 03 FG 1122', startTime: '2025-10-04T09:30:00', endTime: '2025-10-04T11:30:00', amount: 850 },
    { rentalId: 'RNT-9007', customerId: 'CUST-6007', vehicle: 'Sedan - MH 14 GH 3344', startTime: '2025-10-06T07:00:00', endTime: '2025-10-06T11:00:00', amount: 1300 },
    { rentalId: 'RNT-9008', customerId: 'CUST-6008', vehicle: 'SUV - KL 07 JK 5566', startTime: '2025-10-07T08:30:00', endTime: '2025-10-07T13:00:00', amount: 2000 },
    { rentalId: 'RNT-9009', customerId: 'CUST-6009', vehicle: 'Sedan - DL 8C LM 7788', startTime: '2025-10-06T09:00:00', endTime: '2025-10-06T12:45:00', amount: 1250 },
    { rentalId: 'RNT-9010', customerId: 'CUST-6010', vehicle: 'Hatchback - TN 11 NO 9900', startTime: '2025-10-05T10:00:00', endTime: '2025-10-05T13:00:00', amount: 1000 },
    { rentalId: 'RNT-9011', customerId: 'CUST-6011', vehicle: 'SUV - TS 08 PQ 2233', startTime: '2025-10-04T12:00:00', endTime: '2025-10-04T18:00:00', amount: 2300 },
    { rentalId: 'RNT-9012', customerId: 'CUST-6012', vehicle: 'Sedan - KA 05 RS 4455', startTime: '2025-10-03T09:15:00', endTime: '2025-10-03T12:30:00', amount: 1150 },
    { rentalId: 'RNT-9013', customerId: 'CUST-6013', vehicle: 'Hatchback - MH 09 TU 6677', startTime: '2025-10-03T14:00:00', endTime: '2025-10-03T17:00:00', amount: 950 },
    { rentalId: 'RNT-9014', customerId: 'CUST-6014', vehicle: 'SUV - DL 2C VW 8899', startTime: '2025-10-02T08:30:00', endTime: '2025-10-02T15:00:00', amount: 2500 },
    { rentalId: 'RNT-9015', customerId: 'CUST-6015', vehicle: 'Sedan - TN 07 XY 3344', startTime: '2025-10-07T07:45:00', endTime: '2025-10-07T10:45:00', amount: 1100 },
    { rentalId: 'RNT-9016', customerId: 'CUST-6016', vehicle: 'Hatchback - KA 02 AB 5566', startTime: '2025-10-06T09:00:00', endTime: '2025-10-06T11:15:00', amount: 880 },
    { rentalId: 'RNT-9017', customerId: 'CUST-6017', vehicle: 'SUV - MH 10 CD 7788', startTime: '2025-10-05T13:00:00', endTime: '2025-10-05T19:00:00', amount: 2700 },
    { rentalId: 'RNT-9018', customerId: 'CUST-6018', vehicle: 'Sedan - KL 05 EF 9900', startTime: '2025-10-04T10:30:00', endTime: '2025-10-04T13:30:00', amount: 1200 },
    { rentalId: 'RNT-9019', customerId: 'CUST-6019', vehicle: 'SUV - DL 1A GH 1122', startTime: '2025-10-07T08:00:00', endTime: '2025-10-07T14:00:00', amount: 2550 },
    { rentalId: 'RNT-9020', customerId: 'CUST-6020', vehicle: 'Hatchback - TS 09 IJ 2233', startTime: '2025-10-03T09:00:00', endTime: '2025-10-03T11:30:00', amount: 940 },
    { rentalId: 'RNT-9021', customerId: 'CUST-6021', vehicle: 'Sedan - KA 06 KL 3344', startTime: '2025-10-05T15:00:00', endTime: '2025-10-05T18:30:00', amount: 1450 },
    { rentalId: 'RNT-9022', customerId: 'CUST-6022', vehicle: 'SUV - MH 13 MN 4455', startTime: '2025-10-06T10:30:00', endTime: '2025-10-06T17:30:00', amount: 2800 },
    { rentalId: 'RNT-9023', customerId: 'CUST-6023', vehicle: 'Hatchback - TN 15 OP 5566', startTime: '2025-10-02T08:00:00', endTime: '2025-10-02T10:30:00', amount: 870 },
    { rentalId: 'RNT-9024', customerId: 'CUST-6024', vehicle: 'Sedan - KL 11 QR 6677', startTime: '2025-10-03T12:00:00', endTime: '2025-10-03T15:00:00', amount: 1250 },
    { rentalId: 'RNT-9025', customerId: 'CUST-6025', vehicle: 'SUV - DL 9C ST 7788', startTime: '2025-10-04T09:30:00', endTime: '2025-10-04T16:00:00', amount: 2450 }

  ];
}


