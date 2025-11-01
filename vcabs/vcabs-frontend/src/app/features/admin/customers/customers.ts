import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CustomerRow {
  customerId: string;
  customerName: string;
  email: string;
  password: string;
  contactNumber: string;
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, NgFor, RouterLink],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class Customers {
  customers: CustomerRow[] = [
    { customerId: 'CUST-3001', customerName: 'Priya Nair', email: 'priya.nair@example.com', password: '••••••••', contactNumber: '+91 98765 43210' },
    { customerId: 'CUST-3002', customerName: 'Arjun Verma', email: 'arjun.verma@example.com', password: '••••••••', contactNumber: '+91 91234 56780' },
    { customerId: 'CUST-3003', customerName: 'Sunita Rao', email: 'sunita.rao@example.com', password: '••••••••', contactNumber: '+91 99887 77665' },
    { customerId: 'CUST-3004', customerName: 'Rakesh Kumar', email: 'rakesh.kumar@example.com', password: '••••••••', contactNumber: '+91 90000 12345' },
    { customerId: 'CUST-3005', customerName: 'Meena Iyer', email: 'meena.iyer@example.com', password: '••••••••', contactNumber: '+91 98765 11122' },
    { customerId: 'CUST-3006', customerName: 'Ajay Singh', email: 'ajay.singh@example.com', password: '••••••••', contactNumber: '+91 91234 22233' },
    { customerId: 'CUST-3007', customerName: 'Kavita Pillai', email: 'kavita.pillai@example.com', password: '••••••••', contactNumber: '+91 99887 33344' },
    { customerId: 'CUST-3008', customerName: 'Rohan Das', email: 'rohan.das@example.com', password: '••••••••', contactNumber: '+91 90000 44455' },
    { customerId: 'CUST-3009', customerName: 'Sonia Kapoor', email: 'sonia.kapoor@example.com', password: '••••••••', contactNumber: '+91 98765 55566' },
    { customerId: 'CUST-3010', customerName: 'Vivek Menon', email: 'vivek.menon@example.com', password: '••••••••', contactNumber: '+91 91234 66677' },
    { customerId: 'CUST-3011', customerName: 'Rajesh Patel', email: 'rajesh.patel@example.com', password: '••••••••', contactNumber: '+91 98765 77788' },
    { customerId: 'CUST-3012', customerName: 'Shilpa Reddy', email: 'shilpa.reddy@example.com', password: '••••••••', contactNumber: '+91 91234 88899' },
    { customerId: 'CUST-3013', customerName: 'Manoj Gupta', email: 'manoj.gupta@example.com', password: '••••••••', contactNumber: '+91 99887 99900' },
    { customerId: 'CUST-3014', customerName: 'Deepika Sharma', email: 'deepika.sharma@example.com', password: '••••••••', contactNumber: '+91 90000 00011' },
    { customerId: 'CUST-3015', customerName: 'Nikhil Joshi', email: 'nikhil.joshi@example.com', password: '••••••••', contactNumber: '+91 98765 11122' },
    { customerId: 'CUST-3016', customerName: 'Pooja Agarwal', email: 'pooja.agarwal@example.com', password: '••••••••', contactNumber: '+91 91234 22233' },
    { customerId: 'CUST-3017', customerName: 'Suresh Kumar', email: 'suresh.kumar@example.com', password: '••••••••', contactNumber: '+91 99887 33344' },
    { customerId: 'CUST-3018', customerName: 'Anjali Singh', email: 'anjali.singh@example.com', password: '••••••••', contactNumber: '+91 90000 44455' },
    { customerId: 'CUST-3019', customerName: 'Ravi Tiwari', email: 'ravi.tiwari@example.com', password: '••••••••', contactNumber: '+91 98765 55566' },
    { customerId: 'CUST-3020', customerName: 'Kavya Nair', email: 'kavya.nair@example.com', password: '••••••••', contactNumber: '+91 91234 66677' },
    { customerId: 'CUST-3021', customerName: 'Amit Patel', email: 'amit.patel@example.com', password: '••••••••', contactNumber: '+91 99887 77788' },
    { customerId: 'CUST-3022', customerName: 'Priya Reddy', email: 'priya.reddy@example.com', password: '••••••••', contactNumber: '+91 90000 88899' },
    { customerId: 'CUST-3023', customerName: 'Vikram Singh', email: 'vikram.singh@example.com', password: '••••••••', contactNumber: '+91 98765 99900' },
    { customerId: 'CUST-3024', customerName: 'Meera Joshi', email: 'meera.joshi@example.com', password: '••••••••', contactNumber: '+91 91234 00011' },
    { customerId: 'CUST-3025', customerName: 'Rohit Shetty', email: 'rohit.shetty@example.com', password: '••••••••', contactNumber: '+91 99887 11122' },
    { customerId: 'CUST-3026', customerName: 'Kiran Rao', email: 'kiran.rao@example.com', password: '••••••••', contactNumber: '+91 90000 22233' },
    { customerId: 'CUST-3027', customerName: 'Divya Menon', email: 'divya.menon@example.com', password: '••••••••', contactNumber: '+91 98765 33344' },
    { customerId: 'CUST-3028', customerName: 'Aman Jain', email: 'aman.jain@example.com', password: '••••••••', contactNumber: '+91 91234 44455' },
    { customerId: 'CUST-3029', customerName: 'Neha Gupta', email: 'neha.gupta@example.com', password: '••••••••', contactNumber: '+91 99887 55566' },
    { customerId: 'CUST-3030', customerName: 'Suresh Patil', email: 'suresh.patil@example.com', password: '••••••••', contactNumber: '+91 90000 66677' },
    { customerId: 'CUST-3031', customerName: 'Anita Desai', email: 'anita.desai@example.com', password: '••••••••', contactNumber: '+91 98765 77788' },
    { customerId: 'CUST-3032', customerName: 'Vikram Singh', email: 'vikram.singh2@example.com', password: '••••••••', contactNumber: '+91 91234 88899' },
    { customerId: 'CUST-3033', customerName: 'Meera Joshi', email: 'meera.joshi2@example.com', password: '••••••••', contactNumber: '+91 99887 99900' },
    { customerId: 'CUST-3034', customerName: 'Rahul Sharma', email: 'rahul.sharma@example.com', password: '••••••••', contactNumber: '+91 90000 00011' },
    { customerId: 'CUST-3035', customerName: 'Sneha Reddy', email: 'sneha.reddy@example.com', password: '••••••••', contactNumber: '+91 98765 11122' }
  ];
}



