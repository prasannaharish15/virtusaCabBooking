import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

interface BillingRow {
  customerId: string;
  kilometer: number;
  amount: number;
  pickup: string;
  drop: string;
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, NgFor, CurrencyPipe, RouterModule],
  templateUrl: './billing.html',
  styleUrl: './billing.css'
})
export class Billing {
  bills: BillingRow[] = [
    { customerId: 'CUST-7001', kilometer: 12.4, amount: 210, pickup: 'MG Road, Bengaluru', drop: 'Indiranagar, Bengaluru' },
    { customerId: 'CUST-7002', kilometer: 8.9, amount: 160, pickup: 'Andheri West, Mumbai', drop: 'BKC, Mumbai' },
    { customerId: 'CUST-7003', kilometer: 16.2, amount: 320, pickup: 'Anna Nagar, Chennai', drop: 'T Nagar, Chennai' },
    { customerId: 'CUST-7004', kilometer: 22.7, amount: 480, pickup: 'Madhapur, Hyderabad', drop: 'Hitech City, Hyderabad' },
    { customerId: 'CUST-7005', kilometer: 5.3, amount: 120, pickup: 'Salt Lake, Kolkata', drop: 'Howrah, Kolkata' },
    { customerId: 'CUST-7001', kilometer: 12.4, amount: 210, pickup: 'MG Road, Bengaluru', drop: 'Indiranagar, Bengaluru' },
    { customerId: 'CUST-7002', kilometer: 8.9, amount: 160, pickup: 'Andheri West, Mumbai', drop: 'BKC, Mumbai' },
    { customerId: 'CUST-7003', kilometer: 16.2, amount: 320, pickup: 'Anna Nagar, Chennai', drop: 'T Nagar, Chennai' },
    { customerId: 'CUST-7004', kilometer: 22.7, amount: 480, pickup: 'Madhapur, Hyderabad', drop: 'Hitech City, Hyderabad' },
    { customerId: 'CUST-7005', kilometer: 5.3, amount: 120, pickup: 'Salt Lake, Kolkata', drop: 'Howrah, Kolkata' },
    { customerId: 'CUST-7006', kilometer: 14.1, amount: 270, pickup: 'Baner, Pune', drop: 'Hinjewadi, Pune' },
    { customerId: 'CUST-7007', kilometer: 10.5, amount: 200, pickup: 'Alwarpet, Chennai', drop: 'Guindy, Chennai' },
    { customerId: 'CUST-7008', kilometer: 6.8, amount: 150, pickup: 'Kukatpally, Hyderabad', drop: 'Miyapur, Hyderabad' },
    { customerId: 'CUST-7009', kilometer: 18.3, amount: 350, pickup: 'BTM Layout, Bengaluru', drop: 'Electronic City, Bengaluru' },
    { customerId: 'CUST-7010', kilometer: 9.2, amount: 180, pickup: 'Powai, Mumbai', drop: 'Vikhroli, Mumbai' },
    { customerId: 'CUST-7011', kilometer: 11.6, amount: 230, pickup: 'Koramangala, Bengaluru', drop: 'HSR Layout, Bengaluru' },
    { customerId: 'CUST-7012', kilometer: 7.9, amount: 160, pickup: 'Viman Nagar, Pune', drop: 'Koregaon Park, Pune' },
    { customerId: 'CUST-7013', kilometer: 21.4, amount: 460, pickup: 'Velachery, Chennai', drop: 'Adyar, Chennai' },
    { customerId: 'CUST-7014', kilometer: 15.7, amount: 310, pickup: 'Jubilee Hills, Hyderabad', drop: 'Gachibowli, Hyderabad' },
    { customerId: 'CUST-7015', kilometer: 13.8, amount: 260, pickup: 'Ballygunge, Kolkata', drop: 'Park Street, Kolkata' },
    { customerId: 'CUST-7016', kilometer: 19.5, amount: 390, pickup: 'Aundh, Pune', drop: 'Kothrud, Pune' },
    { customerId: 'CUST-7017', kilometer: 23.1, amount: 500, pickup: 'Marathahalli, Bengaluru', drop: 'Whitefield, Bengaluru' },
    { customerId: 'CUST-7018', kilometer: 9.7, amount: 175, pickup: 'Chembur, Mumbai', drop: 'Kurla, Mumbai' },
    { customerId: 'CUST-7019', kilometer: 12.9, amount: 240, pickup: 'Rajajinagar, Bengaluru', drop: 'Malleswaram, Bengaluru' },
    { customerId: 'CUST-7020', kilometer: 17.6, amount: 360, pickup: 'Tollygunge, Kolkata', drop: 'Dumdum, Kolkata' },
    { customerId: 'CUST-7021', kilometer: 8.3, amount: 150, pickup: 'Porur, Chennai', drop: 'Vadapalani, Chennai' },
    { customerId: 'CUST-7022', kilometer: 10.8, amount: 210, pickup: 'Begumpet, Hyderabad', drop: 'Secunderabad, Hyderabad' },
    { customerId: 'CUST-7023', kilometer: 6.4, amount: 130, pickup: 'Khar West, Mumbai', drop: 'Bandra East, Mumbai' },
    { customerId: 'CUST-7024', kilometer: 20.2, amount: 420, pickup: 'Bannerghatta, Bengaluru', drop: 'Jayanagar, Bengaluru' },
    { customerId: 'CUST-7025', kilometer: 11.3, amount: 220, pickup: 'Hadapsar, Pune', drop: 'Magarpatta, Pune' }

  ];
}


