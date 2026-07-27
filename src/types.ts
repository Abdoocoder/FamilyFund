export type PaymentStatus = 'paid' | 'unpaid' | 'pending';

export interface Member {
  id: string;
  name: string;
  phone: string;
  initials: string;
  branch?: string; // e.g. آل محمد, آل عبد العزيز
  status: 'active' | 'archived';
  subscriptionAmount: number; // e.g., 200 SAR/month or 1000 SAR/year
  createdAt: string;
}

export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface PaymentRecord {
  memberId: string;
  year: number;
  month: MonthNumber; // 1-12
  status: PaymentStatus;
  amount: number;
  updatedAt?: string;
  note?: string;
}

export interface Transaction {
  id: string;
  memberName: string;
  memberId: string;
  amount: number;
  date: string; // e.g., "اليوم، 10:30 صباحاً"
  isoDate: string;
  status: 'completed' | 'processing' | 'failed';
  monthYear: string; // e.g., "مارس 2024"
  note?: string;
}

export type ActiveTab = 'dashboard' | 'payments' | 'members' | 'history';

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}
