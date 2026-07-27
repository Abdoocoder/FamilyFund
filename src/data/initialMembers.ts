import { Member, PaymentRecord, Transaction } from '../types';

// List of 48 family members for "صندوق العائلة" - عائلة أبو كف
export const INITIAL_MEMBERS: Member[] = [
  { id: 'mem-1', name: 'محمد سالم أبوكف', phone: '', initials: 'م.س', branch: 'فرع سالم', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-2', name: 'أيمن محمد أبوكف', phone: '', initials: 'أ.م', branch: 'فرع محمد', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-3', name: 'أسامة محمد أبوكف', phone: '', initials: 'أ.م', branch: 'فرع محمد', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-4', name: 'موسى محمد أبوكف', phone: '', initials: 'م.م', branch: 'فرع محمد', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-5', name: 'سالم محمد أبوكف', phone: '', initials: 'س.م', branch: 'فرع محمد', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-6', name: 'بلال محمد أبوكف', phone: '', initials: 'ب.م', branch: 'فرع محمد', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-7', name: 'أشرف محمود أبوكف', phone: '', initials: 'أ.م', branch: 'فرع محمود', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-8', name: 'امجد محمود أبوكف', phone: '', initials: 'أ.م', branch: 'فرع محمود', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-9', name: 'أحمد محمود أبوكف', phone: '', initials: 'أ.م', branch: 'فرع محمود', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-10', name: 'إبراهيم محمود أبوكف', phone: '', initials: 'إ.م', branch: 'فرع محمود', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-11', name: 'سعيد محمود أبوكف', phone: '', initials: 'س.م', branch: 'فرع محمود', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-12', name: 'خالد جمال أبوكف', phone: '', initials: 'خ.ج', branch: 'فرع جمال', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-13', name: 'نزال جمال أبوكف', phone: '', initials: 'ن.ج', branch: 'فرع جمال', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-14', name: 'محمد جمال أبوكف', phone: '', initials: 'م.ج', branch: 'فرع جمال', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-15', name: 'سالم جمال أبوكف', phone: '', initials: 'س.ج', branch: 'فرع جمال', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-16', name: 'أحمد جمال أبوكف', phone: '', initials: 'أ.ج', branch: 'فرع جمال', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-17', name: 'فراس جمال أبوكف', phone: '', initials: 'ف.ج', branch: 'فرع جمال', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-18', name: 'راشد فراس أبوكف', phone: '', initials: 'ر.ف', branch: 'فرع فراس', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-19', name: 'يزيد فاس أبوكف', phone: '', initials: 'ي.ف', branch: 'فرع فاس', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-20', name: 'هاشم عليان أبوكف', phone: '', initials: 'ه.ع', branch: 'فرع عليان', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-21', name: 'عليان هاشم أبوكف', phone: '', initials: 'ع.ه', branch: 'فرع هاشم', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-22', name: 'إبراهيم هاشم أبوكف', phone: '', initials: 'إ.ه', branch: 'فرع هاشم', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-23', name: 'محمود عطا أبوكف', phone: '', initials: 'م.ع', branch: 'فرع عطا', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-24', name: 'محمد عطا أبوكف', phone: '', initials: 'م.ع', branch: 'فرع عطا', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-25', name: 'سلمان خليل أبوكف', phone: '', initials: 'س.خ', branch: 'فرع خليل', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-26', name: 'خالد خليل أبوكف', phone: '', initials: 'خ.خ', branch: 'فرع خليل', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-27', name: 'فهد خليل أبوكف', phone: '', initials: 'ف.خ', branch: 'فرع خليل', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-28', name: 'محمد خليل أبوكف', phone: '', initials: 'م.خ', branch: 'فرع خليل', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-29', name: 'عمر خليل أبوكف', phone: '', initials: 'ع.خ', branch: 'فرع خليل', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-30', name: 'معاذ سلمان أبوكف', phone: '', initials: 'م.س', branch: 'فرع سلمان', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-31', name: 'قدر سلمان أبوكف', phone: '', initials: 'ق.س', branch: 'فرع سلمان', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-32', name: 'خليل محمد أبوكف', phone: '', initials: 'خ.م', branch: 'فرع محمد', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-33', name: 'صالح سليمان أبوكف', phone: '', initials: 'ص.س', branch: 'فرع سليمان', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-34', name: 'محمد صالح أبوكف', phone: '', initials: 'م.ص', branch: 'فرع صالح', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-35', name: 'أحمد حسن أبوكف', phone: '', initials: 'أ.ح', branch: 'فرع حسن', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-36', name: 'عبدالله حسن أبوكف', phone: '', initials: 'ع.ح', branch: 'فرع حسن', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-37', name: 'محمد موسى أبوكف', phone: '', initials: 'م.م', branch: 'فرع موسى', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-38', name: 'بسام موسى أبوكف', phone: '', initials: 'ب.م', branch: 'فرع موسى', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-39', name: 'صالح موسى أبوكف', phone: '', initials: 'ص.م', branch: 'فرع موسى', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-40', name: 'سليمان موسى أبوكف', phone: '', initials: 'س.م', branch: 'فرع موسى', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-41', name: 'موسى صالح أبوكف', phone: '', initials: 'م.ص', branch: 'فرع صالح', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-42', name: 'كريم علي أبوكف', phone: '', initials: 'ك.ع', branch: 'فرع علي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-43', name: 'خالد علي أبوكف', phone: '', initials: 'خ.ع', branch: 'فرع علي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-44', name: 'محمد علي أبوكف', phone: '', initials: 'م.ع', branch: 'فرع علي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-45', name: 'سلامة علي أبوكف', phone: '', initials: 'س.ع', branch: 'فرع علي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-46', name: 'غازي علي أبوكف', phone: '', initials: 'غ.ع', branch: 'فرع علي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-47', name: 'خليل علي أبوكف', phone: '', initials: 'خ.ع', branch: 'فرع علي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-48', name: 'بشار كريم أبوكف', phone: '', initials: 'ب.ك', branch: 'فرع كريم', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
];

export const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

// Generate initial matrix payments for 2024, 2025, 2026
export const generateInitialPayments = (): PaymentRecord[] => {
  const records: PaymentRecord[] = [];
  const years = [2024, 2025, 2026];

  INITIAL_MEMBERS.forEach((member, index) => {
    years.forEach(year => {
      for (let month = 1; month <= 12; month++) {
        let status: 'paid' | 'unpaid' | 'pending' = 'unpaid';

        if (year === 2024) {
          // Fully paid or high compliance for 2024
          if (index % 5 === 0) {
            status = 'paid';
          } else if (month <= 8) {
            status = 'paid';
          } else if (month === 9 && index % 3 === 0) {
            status = 'pending';
          } else if (month <= 10 && index % 2 === 0) {
            status = 'paid';
          }
        } else if (year === 2025) {
          // Mixed compliance for 2025
          if (index % 4 === 0) {
            status = 'paid';
          } else if (month <= 6) {
            status = 'paid';
          } else if (month === 7 && index % 2 === 0) {
            status = 'pending';
          }
        } else if (year === 2026) {
          // Current active year: months 1-3 mostly paid/pending, 4-12 unpaid
          if (month === 1 || month === 2) {
            status = index % 3 === 0 ? 'paid' : (index % 3 === 1 ? 'paid' : 'pending');
          } else if (month === 3) {
            status = index % 4 === 0 ? 'paid' : (index % 4 === 1 ? 'pending' : 'unpaid');
          } else {
            status = 'unpaid';
          }
        }

        records.push({
          memberId: member.id,
          year,
          month: month as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
          status,
          amount: member.subscriptionAmount,
        });
      }
    });
  });

  return records;
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    memberName: 'إبراهيم محمود أبوكف',
    memberId: 'mem-10',
    amount: 1000,
    date: 'اليوم، 10:30 صباحاً',
    isoDate: new Date().toISOString(),
    status: 'completed',
    monthYear: 'مارس 2026',
    note: 'سداد اشتراك 5 أشهر',
  },
  {
    id: 'tx-2',
    memberName: 'محمد سالم أبوكف',
    memberId: 'mem-1',
    amount: 500,
    date: 'أمس، 04:15 مساءً',
    isoDate: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    monthYear: 'مارس 2026',
    note: 'تحويل بنكي الراجحي',
  },
  {
    id: 'tx-3',
    memberName: 'أحمد جمال أبوكف',
    memberId: 'mem-4',
    amount: 2000,
    date: '12 مارس 2026',
    isoDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'processing',
    monthYear: 'مارس 2026',
    note: 'سداد عن العام بالكامل (قيد المراجعة)',
  },
  {
    id: 'tx-4',
    memberName: 'أسامة محمد أبوكف',
    memberId: 'mem-8',
    amount: 200,
    date: '10 مارس 2026',
    isoDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'completed',
    monthYear: 'مارس 2026',
    note: 'نقداً',
  },
  {
    id: 'tx-5',
    memberName: 'فهد خليل أبوكف',
    memberId: 'mem-2',
    amount: 400,
    date: '05 مارس 2026',
    isoDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    status: 'completed',
    monthYear: 'فبراير 2026',
    note: 'سداد شهرين',
  }
];
