import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

interface DriverRow {
  driverId: string;
  driverName: string;
  cabNumber: string;
  photoUrl: string;
  contact: string;
}

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule, NgFor, RouterModule],
  templateUrl: './driver.html',
  styleUrl: './driver.css'
})
export class Driver {
  drivers: DriverRow[] = [
    { driverId: 'DRV-5001', driverName: 'Arun Kumar', cabNumber: 'KA 01 AB 1234', photoUrl: 'https://i.pravatar.cc/80?img=12', contact: '+91 98765 43210' },
    { driverId: 'DRV-5002', driverName: 'Bhavesh Patel', cabNumber: 'MH 12 XY 4567', photoUrl: 'https://i.pravatar.cc/80?img=22', contact: '+91 91234 56780' },
    { driverId: 'DRV-5003', driverName: 'Chirag Shah', cabNumber: 'DL 3C AE 7890', photoUrl: 'https://i.pravatar.cc/80?img=32', contact: '+91 99887 77665' },
    { driverId: 'DRV-5004', driverName: 'Deepa Nair', cabNumber: 'TN 10 BC 2345', photoUrl: 'https://i.pravatar.cc/80?img=42', contact: '+91 90000 12345' },
    { driverId: 'DRV-5005', driverName: 'Ehsan Ali', cabNumber: 'TS 07 CD 6789', photoUrl: 'https://i.pravatar.cc/80?img=52', contact: '+91 98765 11122' },
    { driverId: 'DRV-5001', driverName: 'Arun Kumar', cabNumber: 'KA 01 AB 1234', photoUrl: 'https://i.pravatar.cc/80?img=12', contact: '+91 98765 43210' },
    { driverId: 'DRV-5002', driverName: 'Bhavesh Patel', cabNumber: 'MH 12 XY 4567', photoUrl: 'https://i.pravatar.cc/80?img=22', contact: '+91 91234 56780' },
    { driverId: 'DRV-5003', driverName: 'Chirag Shah', cabNumber: 'DL 3C AE 7890', photoUrl: 'https://i.pravatar.cc/80?img=32', contact: '+91 99887 77665' },
    { driverId: 'DRV-5004', driverName: 'Deepa Nair', cabNumber: 'TN 10 BC 2345', photoUrl: 'https://i.pravatar.cc/80?img=42', contact: '+91 90000 12345' },
    { driverId: 'DRV-5005', driverName: 'Ehsan Ali', cabNumber: 'TS 07 CD 6789', photoUrl: 'https://i.pravatar.cc/80?img=52', contact: '+91 98765 11122' },
    { driverId: 'DRV-5006', driverName: 'Farhan Shaikh', cabNumber: 'MH 01 DE 4562', photoUrl: 'https://i.pravatar.cc/80?img=61', contact: '+91 98653 22441' },
    { driverId: 'DRV-5007', driverName: 'Gopal Verma', cabNumber: 'UP 14 FG 9845', photoUrl: 'https://i.pravatar.cc/80?img=72', contact: '+91 98234 99887' },
    { driverId: 'DRV-5008', driverName: 'Harish Reddy', cabNumber: 'AP 09 GH 2277', photoUrl: 'https://i.pravatar.cc/80?img=83', contact: '+91 90012 33456' },
    { driverId: 'DRV-5009', driverName: 'Imran Khan', cabNumber: 'RJ 27 IJ 4401', photoUrl: 'https://i.pravatar.cc/80?img=93', contact: '+91 98100 45223' },
    { driverId: 'DRV-5010', driverName: 'Jayanthi Rao', cabNumber: 'KA 05 JK 7823', photoUrl: 'https://i.pravatar.cc/80?img=18', contact: '+91 98760 11234' },
    { driverId: 'DRV-5011', driverName: 'Karthik Iyer', cabNumber: 'TN 11 LM 2210', photoUrl: 'https://i.pravatar.cc/80?img=24', contact: '+91 95673 44210' },
    { driverId: 'DRV-5012', driverName: 'Lata Deshmukh', cabNumber: 'MH 14 NO 3388', photoUrl: 'https://i.pravatar.cc/80?img=30', contact: '+91 99876 55664' },
    { driverId: 'DRV-5013', driverName: 'Manoj Singh', cabNumber: 'DL 1P PQ 5542', photoUrl: 'https://i.pravatar.cc/80?img=40', contact: '+91 98745 23456' },
    { driverId: 'DRV-5014', driverName: 'Nirmala Devi', cabNumber: 'KA 09 QR 7810', photoUrl: 'https://i.pravatar.cc/80?img=50', contact: '+91 91230 87456' },
    { driverId: 'DRV-5015', driverName: 'Om Prakash', cabNumber: 'UP 16 ST 2231', photoUrl: 'https://i.pravatar.cc/80?img=60', contact: '+91 98711 55443' },
    { driverId: 'DRV-5016', driverName: 'Pooja Sharma', cabNumber: 'GJ 05 UV 1290', photoUrl: 'https://i.pravatar.cc/80?img=70', contact: '+91 93450 88221' },
    { driverId: 'DRV-5017', driverName: 'Ramesh Patel', cabNumber: 'MH 12 WX 7764', photoUrl: 'https://i.pravatar.cc/80?img=80', contact: '+91 98123 44477' },
    { driverId: 'DRV-5018', driverName: 'Sanjana Das', cabNumber: 'WB 02 XY 9110', photoUrl: 'https://i.pravatar.cc/80?img=90', contact: '+91 90212 66778' },
    { driverId: 'DRV-5019', driverName: 'Tahir Hussain', cabNumber: 'DL 4C ZA 8841', photoUrl: 'https://i.pravatar.cc/80?img=11', contact: '+91 98450 33210' },
    { driverId: 'DRV-5020', driverName: 'Usha Rani', cabNumber: 'TN 13 AB 5590', photoUrl: 'https://i.pravatar.cc/80?img=15', contact: '+91 90123 66700' },
    { driverId: 'DRV-5021', driverName: 'Vikram Mehta', cabNumber: 'GJ 06 CD 6612', photoUrl: 'https://i.pravatar.cc/80?img=25', contact: '+91 99801 23344' },
    { driverId: 'DRV-5022', driverName: 'Wasim Akhtar', cabNumber: 'TS 09 EF 3311', photoUrl: 'https://i.pravatar.cc/80?img=35', contact: '+91 98712 55660' },
    { driverId: 'DRV-5023', driverName: 'Xavier Dsouza', cabNumber: 'GA 07 GH 2245', photoUrl: 'https://i.pravatar.cc/80?img=45', contact: '+91 98210 77980' },
    { driverId: 'DRV-5024', driverName: 'Yamini Pillai', cabNumber: 'KL 08 IJ 7711', photoUrl: 'https://i.pravatar.cc/80?img=55', contact: '+91 90144 66778' },
    { driverId: 'DRV-5025', driverName: 'Zafar Khan', cabNumber: 'MP 09 KL 5532', photoUrl: 'https://i.pravatar.cc/80?img=65', contact: '+91 98333 11990' }

  ];
}


