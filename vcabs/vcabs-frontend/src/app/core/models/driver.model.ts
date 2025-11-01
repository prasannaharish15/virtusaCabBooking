export interface StatusLog {
  status: 'Online' | 'Offline' | 'Break';
  timestamp: Date;
  note?: string;
  reason?: string;
}
