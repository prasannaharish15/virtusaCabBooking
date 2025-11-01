import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatusLog {
  status: 'Online' | 'Offline' | 'Break';
  timestamp: Date;
  note?: string;
  reason?: string;
}

@Component({
  selector: 'app-status-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-summary.html',
  styleUrls: ['./status-summary.css']
})
export class StatusSummaryComponent implements OnInit {
  @Input() currentStatus: 'Online' | 'Offline' | 'Break' = 'Offline';
  @Input() currentTimestamp: Date = new Date();
  @Input() statusLogs: StatusLog[] = [];

  private storageKey = 'driverStatusLogs';

  ngOnInit() {
    this.loadLogsFromStorage();
  }

  // ADD THIS METHOD - it was missing
  addNewLog(log: StatusLog) {
    this.statusLogs.unshift(log);
    this.currentStatus = log.status;
    this.currentTimestamp = log.timestamp;
    
    this.saveLogsToStorage();
    this.autoExportToFile();
    
    console.log('New log added:', log);
  }

   getStatusDuration(log: StatusLog, index: number): string {
    if (index === 0) return 'Current';
    
    const nextLog = this.statusLogs[index - 1];
    const duration = nextLog.timestamp.getTime() - log.timestamp.getTime();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  }
  loadLogsFromStorage() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.statusLogs = parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      } catch (error) {
        console.error('Error loading status logs:', error);
      }
    }
  }

  saveLogsToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.statusLogs));
    } catch (error) {
      console.error('Error saving status logs:', error);
    }
  }

  autoExportToFile() {
    const dataStr = JSON.stringify(this.statusLogs, null, 2);
    console.log('Status logs updated in JSON format:', dataStr);
  }

  downloadStatusLogs() {
    const dataStr = JSON.stringify(this.statusLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'statuslogger.json');
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  }

  clearLogs() {
    this.statusLogs = [];
    this.saveLogsToStorage();
  }
}
