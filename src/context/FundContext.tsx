import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, PaymentRecord, Transaction, ActiveTab, PaymentStatus, MonthNumber, AuditLog } from '../types';
import { INITIAL_MEMBERS, generateInitialPayments, INITIAL_TRANSACTIONS, ARABIC_MONTHS } from '../data/initialMembers';

interface FundContextType {
  members: Member[];
  payments: PaymentRecord[];
  transactions: Transaction[];
  auditLogs: AuditLog[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: MonthNumber;
  setSelectedMonth: (month: MonthNumber) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: 'all' | 'fully_paid' | 'overdue';
  setStatusFilter: (filter: 'all' | 'fully_paid' | 'overdue') => void;
  
  // Member actions
  addMember: (data: Omit<Member, 'id' | 'createdAt'>) => void;
  updateMember: (id: string, data: Partial<Member>) => void;
  toggleMemberArchive: (id: string) => void;
  
  // Payment actions
  togglePayment: (memberId: string, year: number, month: MonthNumber) => void;
  setPaymentStatus: (memberId: string, year: number, month: MonthNumber, status: PaymentStatus) => void;
  recordNewPayment: (data: { memberId: string; amount: number; month: MonthNumber; year: number; note?: string }) => void;
  
  // Utilities
  exportToCSV: () => void;
  resetData: () => void;
  getMemberYearTotal: (memberId: string, year: number) => number;
  getYearStats: (year: number) => {
    expected: number;
    collected: number;
    remaining: number;
    complianceRate: number;
  };
}

const FundContext = createContext<FundContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MEMBERS: 'family_fund_members_v1',
  PAYMENTS: 'family_fund_payments_v1',
  TRANSACTIONS: 'family_fund_transactions_v1',
  LOGS: 'family_fund_logs_v1',
};

export const FundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : generateInitialPayments();
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : [
      { id: '1', action: 'تهيئة النظام', performedBy: 'المحاسب', timestamp: new Date().toLocaleTimeString('ar-SA'), details: 'تم استيراد قائمة الأعضاء الـ 48' }
    ];
  });

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<MonthNumber>((new Date().getMonth() + 1) as MonthNumber);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'fully_paid' | 'overdue'>('all');

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: Date.now().toString(),
      action,
      performedBy: 'المحاسب',
      timestamp: new Date().toLocaleTimeString('ar-SA'),
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addMember = (data: Omit<Member, 'id' | 'createdAt'>) => {
    const id = `mem-${Date.now()}`;
    const newMember: Member = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    setMembers(prev => [newMember, ...prev]);

    // Create 12 month payment slots for the current year and next year
    const currentYear = new Date().getFullYear();
    const newRecords: PaymentRecord[] = [];
    [currentYear - 1, currentYear, currentYear + 1].forEach(yr => {
      for (let m = 1; m <= 12; m++) {
        newRecords.push({
          memberId: id,
          year: yr,
          month: m as MonthNumber,
          status: 'unpaid',
          amount: data.subscriptionAmount || 200,
        });
      }
    });

    setPayments(prev => [...prev, ...newRecords]);
    addAuditLog('إضافة عضو', `تمت إضافة العضو: ${data.name}`);
  };

  const updateMember = (id: string, data: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
    addAuditLog('تعديل عضو', `تم تحديث بيانات العضو ID: ${id}`);
  };

  const toggleMemberArchive = (id: string) => {
    const target = members.find(m => m.id === id);
    if (!target) return;
    const newStatus = target.status === 'active' ? 'archived' : 'active';
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    addAuditLog(newStatus === 'archived' ? 'أرشفة عضو' : 'استعادة عضو', `تغيير حالة ${target.name} إلى ${newStatus === 'archived' ? 'مؤرشف' : 'نشط'}`);
  };

  const togglePayment = (memberId: string, year: number, month: MonthNumber) => {
    setPayments(prev => {
      const existing = prev.find(p => p.memberId === memberId && p.year === year && p.month === month);
      const member = members.find(m => m.id === memberId);
      const amount = member ? member.subscriptionAmount : 200;

      if (!existing) {
        return [...prev, { memberId, year, month, status: 'paid', amount }];
      }

      const nextStatus: PaymentStatus = existing.status === 'paid' ? 'unpaid' : 'paid';
      return prev.map(p => 
        (p.memberId === memberId && p.year === year && p.month === month)
          ? { ...p, status: nextStatus }
          : p
      );
    });

    const member = members.find(m => m.id === memberId);
    if (member) {
      addAuditLog('تعديل حالة الدفع', `تغيير دفع ${member.name} لشهر ${ARABIC_MONTHS[month - 1]} ${year}`);
    }
  };

  const setPaymentStatus = (memberId: string, year: number, month: MonthNumber, status: PaymentStatus) => {
    setPayments(prev => {
      const member = members.find(m => m.id === memberId);
      const amount = member ? member.subscriptionAmount : 200;
      const index = prev.findIndex(p => p.memberId === memberId && p.year === year && p.month === month);

      if (index === -1) {
        return [...prev, { memberId, year, month, status, amount }];
      }

      const updated = [...prev];
      updated[index] = { ...updated[index], status };
      return updated;
    });
  };

  const recordNewPayment = (data: { memberId: string; amount: number; month: MonthNumber; year: number; note?: string }) => {
    const member = members.find(m => m.id === data.memberId);
    if (!member) return;

    // Update payment record
    setPaymentStatus(data.memberId, data.year, data.month, 'paid');

    // Add transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      memberName: member.name,
      memberId: member.id,
      amount: data.amount,
      date: 'اليوم، ' + new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      isoDate: new Date().toISOString(),
      status: 'completed',
      monthYear: `${ARABIC_MONTHS[data.month - 1]} ${data.year}`,
      note: data.note || 'تسجيل دفعة جديدة',
    };

    setTransactions(prev => [newTx, ...prev]);
    addAuditLog('تسجيل دفعة جديدة', `استلام ${data.amount} د.أ من ${member.name} لشهر ${ARABIC_MONTHS[data.month - 1]} ${data.year}`);
  };

  const getMemberYearTotal = (memberId: string, year: number) => {
    const memberPayments = payments.filter(p => p.memberId === memberId && p.year === year && p.status === 'paid');
    return memberPayments.reduce((sum, p) => sum + (p.amount || 200), 0);
  };

  const getYearStats = (year: number) => {
    const activeMembers = members.filter(m => m.status === 'active');

    // Expected for full year = sum of each active member's annual subscription
    const expected = activeMembers.reduce(
      (sum, m) => sum + m.subscriptionAmount * 12,
      0
    );

    const yearPayments = payments.filter(p => p.year === year && p.status === 'paid');
    const collected = yearPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = Math.max(0, expected - collected);

    const paidSlots = yearPayments.length;
    const totalSlots = activeMembers.length * 12;
    const complianceRate = totalSlots > 0 ? Math.round((paidSlots / totalSlots) * 100) : 0;

    return { expected, collected, remaining, complianceRate };
  };

  const exportToCSV = () => {
    const activeMembers = members.filter(m => m.status === 'active');
    let csv = '\uFEFF'; // UTF-8 BOM for Arabic support in Excel
    csv += 'العضو,الهاتف,الفرع,مجموع ' + selectedYear + ' (د.أ),' + ARABIC_MONTHS.join(',') + '\n';

    activeMembers.forEach(member => {
      const row = [
        `"${member.name}"`,
        `"${member.phone}"`,
        `"${member.branch || '-'}"`,
        getMemberYearTotal(member.id, selectedYear),
      ];

      for (let m = 1; m <= 12; m++) {
        const record = payments.find(p => p.memberId === member.id && p.year === selectedYear && p.month === m);
        const statusText = record?.status === 'paid' ? 'مسدد' : (record?.status === 'pending' ? 'قيد المراجعة' : 'غير مسدد');
        row.push(`"${statusText}"`);
      }

      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `صندوق_العائلة_جدول_مدفوعات_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addAuditLog('تصدير بيانات', `تصدير ملف Excel لعام ${selectedYear}`);
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    setMembers(INITIAL_MEMBERS);
    setPayments(generateInitialPayments());
    setTransactions(INITIAL_TRANSACTIONS);
    setAuditLogs([]);
  };

  return (
    <FundContext.Provider value={{
      members,
      payments,
      transactions,
      auditLogs,
      selectedYear,
      setSelectedYear,
      selectedMonth,
      setSelectedMonth,
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      statusFilter,
      setStatusFilter,
      addMember,
      updateMember,
      toggleMemberArchive,
      togglePayment,
      setPaymentStatus,
      recordNewPayment,
      exportToCSV,
      resetData,
      getMemberYearTotal,
      getYearStats,
    }}>
      {children}
    </FundContext.Provider>
  );
};

export const useFund = () => {
  const context = useContext(FundContext);
  if (!context) {
    throw new Error('useFund must be used within a FundProvider');
  }
  return context;
};
