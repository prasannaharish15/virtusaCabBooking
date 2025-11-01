import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

interface CancelledRideRow {
  customerId: string;
  customerName: string;
  driverId: string;
  pickupLocation: string;
  dropLocation: string;
  cancellationReason: string;
  refundAmount: number;
}

@Component({
  selector: 'app-cancelled-rides',
  standalone: true,
  imports: [CommonModule, NgFor, CurrencyPipe, RouterModule],
  templateUrl: './cancelled-rides.html',
  styleUrl: './cancelled-rides.css'
})
export class CancelledRides {
  rides: CancelledRideRow[] = [
    { customerId: 'CUST-4001', customerName: 'Harish Iyer', driverId: 'DRV-410', pickupLocation: 'Andheri East, Mumbai', dropLocation: 'BKC, Mumbai', cancellationReason: 'Driver unavailable', refundAmount: 300 },
    { customerId: 'CUST-4002', customerName: 'Pallavi Sinha', driverId: 'DRV-411', pickupLocation: 'Indiranagar, Bengaluru', dropLocation: 'Koramangala, Bengaluru', cancellationReason: 'Customer no-show', refundAmount: 0 },
    { customerId: 'CUST-4003', customerName: 'Karan Mehta', driverId: 'DRV-412', pickupLocation: 'Gariahat, Kolkata', dropLocation: 'Salt Lake, Kolkata', cancellationReason: 'Payment issue', refundAmount: 200 },
    { customerId: 'CUST-4004', customerName: 'Tanya Kapoor', driverId: 'DRV-413', pickupLocation: 'Madhapur, Hyderabad', dropLocation: 'Hitech City, Hyderabad', cancellationReason: 'Route changed', refundAmount: 150 },
    { customerId: 'CUST-4005', customerName: 'Abhishek Jain', driverId: 'DRV-414', pickupLocation: 'Adyar, Chennai', dropLocation: 'T Nagar, Chennai', cancellationReason: 'Emergency', refundAmount: 250 },
    { customerId: 'CUST-4006', customerName: 'Pooja Shah', driverId: 'DRV-415', pickupLocation: 'Sector 29, Gurgaon', dropLocation: 'Cyber City, Gurgaon', cancellationReason: 'Late arrival', refundAmount: 180 },
    { customerId: 'CUST-4007', customerName: 'Nitin Rao', driverId: 'DRV-416', pickupLocation: 'Vashi, Navi Mumbai', dropLocation: 'Panvel, Navi Mumbai', cancellationReason: 'Weather', refundAmount: 220 },
    { customerId: 'CUST-4008', customerName: 'Rhea Dutta', driverId: 'DRV-417', pickupLocation: 'Baner, Pune', dropLocation: 'Hinjewadi, Pune', cancellationReason: 'Customer cancelled', refundAmount: 100 },
    { customerId: 'CUST-4009', customerName: 'Zoya Khan', driverId: 'DRV-418', pickupLocation: 'BTM Layout, Bengaluru', dropLocation: 'HSR Layout, Bengaluru', cancellationReason: 'Vehicle issue', refundAmount: 260 },
    { customerId: 'CUST-4010', customerName: 'Gaurav Singh', driverId: 'DRV-419', pickupLocation: 'Powai, Mumbai', dropLocation: 'Colaba, Mumbai', cancellationReason: 'Traffic delay', refundAmount: 200 },
    { customerId: 'CUST-4011', customerName: 'Rohit Verma', driverId: 'DRV-420', pickupLocation: 'Whitefield, Bengaluru', dropLocation: 'Electronic City, Bengaluru', cancellationReason: 'Driver unavailable', refundAmount: 300 },
    { customerId: 'CUST-4012', customerName: 'Sneha Reddy', driverId: 'DRV-421', pickupLocation: 'Ameerpet, Hyderabad', dropLocation: 'Gachibowli, Hyderabad', cancellationReason: 'Customer no-show', refundAmount: 0 },
    { customerId: 'CUST-4013', customerName: 'Vikram Desai', driverId: 'DRV-422', pickupLocation: 'Kothrud, Pune', dropLocation: 'Viman Nagar, Pune', cancellationReason: 'Payment issue', refundAmount: 200 },
    { customerId: 'CUST-4014', customerName: 'Meera Nair', driverId: 'DRV-423', pickupLocation: 'Jayanagar, Bengaluru', dropLocation: 'Majestic, Bengaluru', cancellationReason: 'Route changed', refundAmount: 120 },
    { customerId: 'CUST-4015', customerName: 'Arjun Sharma', driverId: 'DRV-424', pickupLocation: 'Goregaon, Mumbai', dropLocation: 'Andheri East, Mumbai', cancellationReason: 'Emergency', refundAmount: 250 },
    { customerId: 'CUST-4016', customerName: 'Divya Patel', driverId: 'DRV-425', pickupLocation: 'Velachery, Chennai', dropLocation: 'Guindy, Chennai', cancellationReason: 'Late arrival', refundAmount: 180 },
    { customerId: 'CUST-4017', customerName: 'Ravi Menon', driverId: 'DRV-426', pickupLocation: 'Salt Lake, Kolkata', dropLocation: 'Howrah, Kolkata', cancellationReason: 'Weather', refundAmount: 220 },
    { customerId: 'CUST-4018', customerName: 'Ananya Das', driverId: 'DRV-427', pickupLocation: 'BTM Layout, Bengaluru', dropLocation: 'HSR Layout, Bengaluru', cancellationReason: 'Customer cancelled', refundAmount: 100 },
    { customerId: 'CUST-4019', customerName: 'Sandeep Pillai', driverId: 'DRV-428', pickupLocation: 'Sector 18, Noida', dropLocation: 'Sector 62, Noida', cancellationReason: 'Vehicle issue', refundAmount: 260 },
    { customerId: 'CUST-4020', customerName: 'Ritika Malhotra', driverId: 'DRV-429', pickupLocation: 'Banjara Hills, Hyderabad', dropLocation: 'Madhapur, Hyderabad', cancellationReason: 'Traffic delay', refundAmount: 200 },
    { customerId: 'CUST-4021', customerName: 'Keshav Joshi', driverId: 'DRV-430', pickupLocation: 'Anna Nagar, Chennai', dropLocation: 'Besant Nagar, Chennai', cancellationReason: 'Payment failed', refundAmount: 150 },
    { customerId: 'CUST-4022', customerName: 'Neha Gupta', driverId: 'DRV-431', pickupLocation: 'Park Street, Kolkata', dropLocation: 'New Town, Kolkata', cancellationReason: 'Customer changed plan', refundAmount: 180 },
    { customerId: 'CUST-4023', customerName: 'Amit Kulkarni', driverId: 'DRV-432', pickupLocation: 'Wakad, Pune', dropLocation: 'Hinjewadi, Pune', cancellationReason: 'Driver delay', refundAmount: 120 },
    { customerId: 'CUST-4024', customerName: 'Priya Ramesh', driverId: 'DRV-433', pickupLocation: 'Koramangala, Bengaluru', dropLocation: 'Indiranagar, Bengaluru', cancellationReason: 'Driver unavailable', refundAmount: 300 },
    { customerId: 'CUST-4025', customerName: 'Tarun Ghosh', driverId: 'DRV-434', pickupLocation: 'Ballygunge, Kolkata', dropLocation: 'Dumdum, Kolkata', cancellationReason: 'Emergency', refundAmount: 250 },
    { customerId: 'CUST-4026', customerName: 'Shruti Vora', driverId: 'DRV-435', pickupLocation: 'Powai, Mumbai', dropLocation: 'Colaba, Mumbai', cancellationReason: 'Customer no-show', refundAmount: 0 },
    { customerId: 'CUST-4027', customerName: 'Naveen Kumar', driverId: 'DRV-436', pickupLocation: 'Kondapur, Hyderabad', dropLocation: 'Miyapur, Hyderabad', cancellationReason: 'Vehicle issue', refundAmount: 220 },
    { customerId: 'CUST-4028', customerName: 'Rohini Bhatt', driverId: 'DRV-437', pickupLocation: 'Sector 44, Gurgaon', dropLocation: 'Cyber Hub, Gurgaon', cancellationReason: 'Route changed', refundAmount: 150 },
    { customerId: 'CUST-4029', customerName: 'Aditya Rao', driverId: 'DRV-438', pickupLocation: 'Vashi, Navi Mumbai', dropLocation: 'Nerul, Navi Mumbai', cancellationReason: 'Late arrival', refundAmount: 180 },
    { customerId: 'CUST-4030', customerName: 'Isha Chatterjee', driverId: 'DRV-439', pickupLocation: 'T Nagar, Chennai', dropLocation: 'Adyar, Chennai', cancellationReason: 'Payment issue', refundAmount: 200 },
    { customerId: 'CUST-4031', customerName: 'Vikas Jain', driverId: 'DRV-440', pickupLocation: 'BTM Layout, Bengaluru', dropLocation: 'Jayanagar, Bengaluru', cancellationReason: 'Customer cancelled', refundAmount: 100 },
    { customerId: 'CUST-4032', customerName: 'Rupal Shah', driverId: 'DRV-441', pickupLocation: 'Aundh, Pune', dropLocation: 'Baner, Pune', cancellationReason: 'Traffic delay', refundAmount: 200 },
    { customerId: 'CUST-4033', customerName: 'Deepak Singh', driverId: 'DRV-442', pickupLocation: 'Bandra, Mumbai', dropLocation: 'Dadar, Mumbai', cancellationReason: 'Driver unavailable', refundAmount: 300 },
    { customerId: 'CUST-4034', customerName: 'Maya Nambiar', driverId: 'DRV-443', pickupLocation: 'Mylapore, Chennai', dropLocation: 'Guindy, Chennai', cancellationReason: 'Emergency', refundAmount: 250 },
    { customerId: 'CUST-4035', customerName: 'Rahul Chawla', driverId: 'DRV-444', pickupLocation: 'Indiranagar, Bengaluru', dropLocation: 'Whitefield, Bengaluru', cancellationReason: 'Payment failed', refundAmount: 150 }
  ];
}



