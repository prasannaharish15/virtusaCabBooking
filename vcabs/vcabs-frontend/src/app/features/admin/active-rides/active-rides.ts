import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ActiveRideRow {
  customerId: string;
  customerName: string;
  driverId: string;
  pickupLocation: string;
  dropLocation: string;
  amount: number;
}

@Component({
  selector: 'app-active-rides',
  standalone: true,
  imports: [CommonModule, NgFor, CurrencyPipe, RouterModule],
  templateUrl: './active-rides.html',
  styleUrl: './active-rides.css'
})
export class ActiveRides {
  rides: ActiveRideRow[] = [
    { customerId: 'CUST-1001', customerName: 'Rahul Sharma', driverId: 'DRV-210', pickupLocation: 'MG Road, Bengaluru', dropLocation: 'Electronic City, Bengaluru', amount: 550 },
    { customerId: 'CUST-1002', customerName: 'Anita Desai', driverId: 'DRV-115', pickupLocation: 'Andheri East, Mumbai', dropLocation: 'BKC, Mumbai', amount: 420 },
    { customerId: 'CUST-1003', customerName: 'Vikram Singh', driverId: 'DRV-312', pickupLocation: 'Salt Lake, Kolkata', dropLocation: 'Howrah, Kolkata', amount: 390 },
    { customerId: 'CUST-1004', customerName: 'Meera Joshi', driverId: 'DRV-198', pickupLocation: 'Gachibowli, Hyderabad', dropLocation: 'Hitech City, Hyderabad', amount: 250 },
    { customerId: 'CUST-1005', customerName: 'Suresh Patil', driverId: 'DRV-201', pickupLocation: 'Vashi, Navi Mumbai', dropLocation: 'Thane, Mumbai', amount: 700 },
    { customerId: 'CUST-1006', customerName: 'Neha Gupta', driverId: 'DRV-202', pickupLocation: 'Kothrud, Pune', dropLocation: 'Shivaji Nagar, Pune', amount: 320 },
    { customerId: 'CUST-1007', customerName: 'Aman Jain', driverId: 'DRV-203', pickupLocation: 'Banjara Hills, Hyderabad', dropLocation: 'Secunderabad, Hyderabad', amount: 480 },
    { customerId: 'CUST-1008', customerName: 'Divya Menon', driverId: 'DRV-204', pickupLocation: 'Alwarpet, Chennai', dropLocation: 'Velachery, Chennai', amount: 410 },
    { customerId: 'CUST-1009', customerName: 'Rohit Shetty', driverId: 'DRV-205', pickupLocation: 'Jayanagar, Bengaluru', dropLocation: 'Whitefield, Bengaluru', amount: 600 },
    { customerId: 'CUST-1010', customerName: 'Kiran Rao', driverId: 'DRV-206', pickupLocation: 'DLF Phase 3, Gurgaon', dropLocation: 'Cyber City, Gurgaon', amount: 350 },
    { customerId: 'CUST-1011', customerName: 'Priya Nair', driverId: 'DRV-207', pickupLocation: 'Sector 18, Noida', dropLocation: 'Connaught Place, Delhi', amount: 450 },
    { customerId: 'CUST-1012', customerName: 'Arjun Verma', driverId: 'DRV-208', pickupLocation: 'Baner, Pune', dropLocation: 'Hinjewadi, Pune', amount: 380 },
    { customerId: 'CUST-1013', customerName: 'Sunita Rao', driverId: 'DRV-209', pickupLocation: 'Anna Nagar, Chennai', dropLocation: 'T Nagar, Chennai', amount: 290 },
    { customerId: 'CUST-1014', customerName: 'Rakesh Kumar', driverId: 'DRV-211', pickupLocation: 'Powai, Mumbai', dropLocation: 'Colaba, Mumbai', amount: 750 },
    { customerId: 'CUST-1015', customerName: 'Meena Iyer', driverId: 'DRV-212', pickupLocation: 'Kukatpally, Hyderabad', dropLocation: 'Madhapur, Hyderabad', amount: 320 },
    { customerId: 'CUST-1016', customerName: 'Ajay Singh', driverId: 'DRV-213', pickupLocation: 'Indiranagar, Bengaluru', dropLocation: 'Koramangala, Bengaluru', amount: 420 },
    { customerId: 'CUST-1017', customerName: 'Kavita Pillai', driverId: 'DRV-214', pickupLocation: 'Gariahat, Kolkata', dropLocation: 'Dumdum, Kolkata', amount: 360 },
    { customerId: 'CUST-1018', customerName: 'Rohan Das', driverId: 'DRV-215', pickupLocation: 'DLF Phase 1, Gurgaon', dropLocation: 'Sohna Road, Gurgaon', amount: 480 },
    { customerId: 'CUST-1019', customerName: 'Sonia Kapoor', driverId: 'DRV-216', pickupLocation: 'Ameerpet, Hyderabad', dropLocation: 'Begumpet, Hyderabad', amount: 340 },
    { customerId: 'CUST-1020', customerName: 'Vivek Menon', driverId: 'DRV-217', pickupLocation: 'BTM Layout, Bengaluru', dropLocation: 'HSR Layout, Bengaluru', amount: 390 },
    { customerId: 'CUST-1021', customerName: 'Rajesh Patel', driverId: 'DRV-218', pickupLocation: 'Malad West, Mumbai', dropLocation: 'Bandra West, Mumbai', amount: 520 },
    { customerId: 'CUST-1022', customerName: 'Shilpa Reddy', driverId: 'DRV-219', pickupLocation: 'Kondapur, Hyderabad', dropLocation: 'Gachibowli, Hyderabad', amount: 280 },
    { customerId: 'CUST-1023', customerName: 'Manoj Gupta', driverId: 'DRV-220', pickupLocation: 'Marathahalli, Bengaluru', dropLocation: 'Bellandur, Bengaluru', amount: 350 },
    { customerId: 'CUST-1024', customerName: 'Deepika Sharma', driverId: 'DRV-221', pickupLocation: 'Park Street, Kolkata', dropLocation: 'Salt Lake, Kolkata', amount: 310 },
    { customerId: 'CUST-1025', customerName: 'Nikhil Joshi', driverId: 'DRV-222', pickupLocation: 'Sector 17, Chandigarh', dropLocation: 'Sector 35, Chandigarh', amount: 200 },
    { customerId: 'CUST-1026', customerName: 'Pooja Agarwal', driverId: 'DRV-223', pickupLocation: 'Vaishali, Ghaziabad', dropLocation: 'Raj Nagar, Ghaziabad', amount: 180 },
    { customerId: 'CUST-1027', customerName: 'Suresh Kumar', driverId: 'DRV-224', pickupLocation: 'Koramangala, Bengaluru', dropLocation: 'Indiranagar, Bengaluru', amount: 250 },
    { customerId: 'CUST-1028', customerName: 'Anjali Singh', driverId: 'DRV-225', pickupLocation: 'Hauz Khas, Delhi', dropLocation: 'Lajpat Nagar, Delhi', amount: 320 },
    { customerId: 'CUST-1029', customerName: 'Ravi Tiwari', driverId: 'DRV-226', pickupLocation: 'Banjara Hills, Hyderabad', dropLocation: 'Jubilee Hills, Hyderabad', amount: 400 },
    { customerId: 'CUST-1030', customerName: 'Kavya Nair', driverId: 'DRV-227', pickupLocation: 'Adyar, Chennai', dropLocation: 'Mylapore, Chennai', amount: 220 }
  ];
}


