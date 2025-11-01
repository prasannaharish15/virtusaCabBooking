import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CompletedRideRow {
  customerId: string;
  customerName: string;
  driverId: string;
  pickupLocation: string;
  dropLocation: string;
  amount: number;
}

@Component({
  selector: 'app-completed-rides',
  standalone: true,
  imports: [CommonModule, NgFor, CurrencyPipe, RouterLink],
  templateUrl: './completed-rides.html',
  styleUrl: './completed-rides.css'
})
export class CompletedRides {
  rides: CompletedRideRow[] = [
    { customerId: 'CUST-2001', customerName: 'Sanjay Mehta', driverId: 'DRV-321', pickupLocation: 'Sector 18, Noida', dropLocation: 'Connaught Place, Delhi', amount: 600 },
    { customerId: 'CUST-2002', customerName: 'Ritu Kapoor', driverId: 'DRV-222', pickupLocation: 'Baner, Pune', dropLocation: 'Hinjewadi, Pune', amount: 350 },
    { customerId: 'CUST-2003', customerName: 'Amit Sinha', driverId: 'DRV-145', pickupLocation: 'Anna Nagar, Chennai', dropLocation: 'T Nagar, Chennai', amount: 280 },
    { customerId: 'CUST-2004', customerName: 'Manoj Pillai', driverId: 'DRV-223', pickupLocation: 'Powai, Mumbai', dropLocation: 'Colaba, Mumbai', amount: 800 },
    { customerId: 'CUST-2005', customerName: 'Shalini Das', driverId: 'DRV-224', pickupLocation: 'Kukatpally, Hyderabad', dropLocation: 'Madhapur, Hyderabad', amount: 270 },
    { customerId: 'CUST-2006', customerName: 'Vikas Yadav', driverId: 'DRV-225', pickupLocation: 'Indiranagar, Bengaluru', dropLocation: 'Koramangala, Bengaluru', amount: 390 },
    { customerId: 'CUST-2007', customerName: 'Sneha Reddy', driverId: 'DRV-226', pickupLocation: 'Gariahat, Kolkata', dropLocation: 'Dumdum, Kolkata', amount: 340 },
    { customerId: 'CUST-2008', customerName: 'Ravi Kumar', driverId: 'DRV-227', pickupLocation: 'DLF Phase 1, Gurgaon', dropLocation: 'Sohna Road, Gurgaon', amount: 420 },
    { customerId: 'CUST-2009', customerName: 'Asha Singh', driverId: 'DRV-228', pickupLocation: 'Ameerpet, Hyderabad', dropLocation: 'Begumpet, Hyderabad', amount: 310 },
    { customerId: 'CUST-2010', customerName: 'Deepak Joshi', driverId: 'DRV-229', pickupLocation: 'BTM Layout, Bengaluru', dropLocation: 'HSR Layout, Bengaluru', amount: 360 },
    { customerId: 'CUST-2011', customerName: 'Rajesh Kumar', driverId: 'DRV-230', pickupLocation: 'Malad West, Mumbai', dropLocation: 'Bandra West, Mumbai', amount: 520 },
    { customerId: 'CUST-2012', customerName: 'Shilpa Nair', driverId: 'DRV-231', pickupLocation: 'Kondapur, Hyderabad', dropLocation: 'Gachibowli, Hyderabad', amount: 280 },
    { customerId: 'CUST-2013', customerName: 'Manoj Gupta', driverId: 'DRV-232', pickupLocation: 'Marathahalli, Bengaluru', dropLocation: 'Bellandur, Bengaluru', amount: 350 },
    { customerId: 'CUST-2014', customerName: 'Deepika Sharma', driverId: 'DRV-233', pickupLocation: 'Park Street, Kolkata', dropLocation: 'Salt Lake, Kolkata', amount: 310 },
    { customerId: 'CUST-2015', customerName: 'Nikhil Joshi', driverId: 'DRV-234', pickupLocation: 'Sector 17, Chandigarh', dropLocation: 'Sector 35, Chandigarh', amount: 200 },
    { customerId: 'CUST-2016', customerName: 'Pooja Agarwal', driverId: 'DRV-235', pickupLocation: 'Vaishali, Ghaziabad', dropLocation: 'Raj Nagar, Ghaziabad', amount: 180 },
    { customerId: 'CUST-2017', customerName: 'Suresh Kumar', driverId: 'DRV-236', pickupLocation: 'Koramangala, Bengaluru', dropLocation: 'Indiranagar, Bengaluru', amount: 250 },
    { customerId: 'CUST-2018', customerName: 'Anjali Singh', driverId: 'DRV-237', pickupLocation: 'Hauz Khas, Delhi', dropLocation: 'Lajpat Nagar, Delhi', amount: 320 },
    { customerId: 'CUST-2019', customerName: 'Ravi Tiwari', driverId: 'DRV-238', pickupLocation: 'Banjara Hills, Hyderabad', dropLocation: 'Jubilee Hills, Hyderabad', amount: 400 },
    { customerId: 'CUST-2020', customerName: 'Kavya Nair', driverId: 'DRV-239', pickupLocation: 'Adyar, Chennai', dropLocation: 'Mylapore, Chennai', amount: 220 },
    { customerId: 'CUST-2021', customerName: 'Amit Patel', driverId: 'DRV-240', pickupLocation: 'Andheri West, Mumbai', dropLocation: 'Goregaon West, Mumbai', amount: 380 },
    { customerId: 'CUST-2022', customerName: 'Priya Reddy', driverId: 'DRV-241', pickupLocation: 'Begumpet, Hyderabad', dropLocation: 'Secunderabad, Hyderabad', amount: 290 },
    { customerId: 'CUST-2023', customerName: 'Vikram Singh', driverId: 'DRV-242', pickupLocation: 'Whitefield, Bengaluru', dropLocation: 'Marathahalli, Bengaluru', amount: 450 },
    { customerId: 'CUST-2024', customerName: 'Meera Joshi', driverId: 'DRV-243', pickupLocation: 'New Market, Kolkata', dropLocation: 'Esplanade, Kolkata', amount: 260 },
    { customerId: 'CUST-2025', customerName: 'Rohit Shetty', driverId: 'DRV-244', pickupLocation: 'Sector 29, Gurgaon', dropLocation: 'Cyber City, Gurgaon', amount: 320 },
    { customerId: 'CUST-2026', customerName: 'Kiran Rao', driverId: 'DRV-245', pickupLocation: 'Madhapur, Hyderabad', dropLocation: 'Hitech City, Hyderabad', amount: 340 },
    { customerId: 'CUST-2027', customerName: 'Divya Menon', driverId: 'DRV-246', pickupLocation: 'Velachery, Chennai', dropLocation: 'Tambaram, Chennai', amount: 280 },
    { customerId: 'CUST-2028', customerName: 'Aman Jain', driverId: 'DRV-247', pickupLocation: 'Kothrud, Pune', dropLocation: 'Wakad, Pune', amount: 300 },
    { customerId: 'CUST-2029', customerName: 'Neha Gupta', driverId: 'DRV-248', pickupLocation: 'Vashi, Navi Mumbai', dropLocation: 'Panvel, Navi Mumbai', amount: 420 },
    { customerId: 'CUST-2030', customerName: 'Suresh Patil', driverId: 'DRV-249', pickupLocation: 'Jayanagar, Bengaluru', dropLocation: 'JP Nagar, Bengaluru', amount: 280 },
    { customerId: 'CUST-2030', customerName: 'Suresh Patil', driverId: "DRV-249", pickupLocation: "Jayanagar, Bengaluru", dropLocation: "JP Nagar, Bengaluru", amount: 280 },
    { customerId: "CUST-2031", customerName: "Priya Sharma", driverId: "DRV-102", pickupLocation: "BTM Layout, Bengaluru", dropLocation: "Koramangala, Bengaluru", amount: 210 },
    { customerId: "CUST-2032", customerName: "Rahul Mehta", driverId: "DRV-315", pickupLocation: "Indiranagar, Bengaluru", dropLocation: "Whitefield, Bengaluru", amount: 420 },
    { customerId: 'CUST-2033', customerName: 'Deepa Reddy', driverId: 'DRV-287', pickupLocation: 'HSR Layout, Bengaluru', dropLocation: 'Electronic City, Bengaluru', amount: 390 }
   
  ];
}


