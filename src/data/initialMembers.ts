import { Member, PaymentRecord, Transaction } from '../types';

// List of 48 family members for "صندوق العائلة"
export const INITIAL_MEMBERS: Member[] = [
  { id: 'mem-1', name: 'أحمد عبدالله', phone: '+966 50 123 4567', initials: 'أ.ع', branch: 'فرع عبد الله', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-2', name: 'سعد المحمد', phone: '+966 55 987 6543', initials: 'س.م', branch: 'فرع محمد', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-3', name: 'خالد عبدالعزيز', phone: '+966 50 111 2233', initials: 'خ.ع', branch: 'فرع عبد العزيز', status: 'archived', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-4', name: 'محمد العلي', phone: '+966 56 444 5555', initials: 'م.ع', branch: 'فرع علي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-5', name: 'عبدالله محمد', phone: '+966 50 888 9999', initials: 'ع.م', branch: 'فرع محمد', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-6', name: 'سالم فهد', phone: '+966 54 222 3333', initials: 'س.ف', branch: 'فرع فهد', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-7', name: 'فهد عبدالرحمن', phone: '+966 55 333 4444', initials: 'ف.ع', branch: 'فرع عبد الرحمن', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-8', name: 'سالم عبدالله', phone: '+966 50 777 6666', initials: 'س.ع', branch: 'فرع عبد الله', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-9', name: 'عمر عبدالعزيز', phone: '+966 53 111 4444', initials: 'ع.ع', branch: 'فرع عبد العزيز', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-10', name: 'إبراهيم الصالح', phone: '+966 50 999 1111', initials: 'إ.ص', branch: 'فرع صالح', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-11', name: 'طارق الخالد', phone: '+966 56 333 8888', initials: 'ط.خ', branch: 'فرع خالد', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-12', name: 'سلطان الناصر', phone: '+966 54 555 1111', initials: 'س.ن', branch: 'فرع ناصر', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-13', name: 'عادل السليمان', phone: '+966 55 666 2222', initials: 'ع.س', branch: 'فرع سليمان', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-14', name: 'فيصل العتيبي', phone: '+966 50 444 3333', initials: 'ف.ع', branch: 'فرع العتيبي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-15', name: 'منصور الدوسري', phone: '+966 53 888 7777', initials: 'م.د', branch: 'فرع الدوسري', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-16', name: 'عبدالمجيد الفهد', phone: '+966 50 666 5555', initials: 'ع.ف', branch: 'فرع فهد', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-17', name: 'ياسر الشمري', phone: '+966 55 111 9999', initials: 'ي.ش', branch: 'فرع الشمري', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-18', name: 'نايف القحطاني', phone: '+966 54 777 2222', initials: 'ن.ق', branch: 'فرع القحطاني', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-19', name: 'بدر التميمي', phone: '+966 50 222 8888', initials: 'ب.ت', branch: 'فرع التميمي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-20', name: 'حامد الشهري', phone: '+966 56 888 3333', initials: 'ح.ش', branch: 'فرع الشهري', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-21', name: 'ماجد المطيري', phone: '+966 53 555 6666', initials: 'م.م', branch: 'فرع المطيري', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-22', name: 'وليد الحربي', phone: '+966 50 333 1111', initials: 'و.ح', branch: 'فرع الحربي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-23', name: 'صالح الزهراني', phone: '+966 55 444 8888', initials: 'ص.ز', branch: 'فرع الزهراني', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-24', name: 'تركي الغامدي', phone: '+966 54 999 4444', initials: 'ت.غ', branch: 'فرع الغامدي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-25', name: 'سعود المالكي', phone: '+966 50 111 5555', initials: 'س.م', branch: 'فرع المالكي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-26', name: 'راشد السبيعي', phone: '+966 56 222 6666', initials: 'ر.س', branch: 'فرع السبيعي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-27', name: 'ثامر العنيزي', phone: '+966 53 777 1111', initials: 'ث.ع', branch: 'فرع العنزي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-28', name: 'هشام الخالدي', phone: '+966 50 555 9999', initials: 'هـ.خ', branch: 'فرع الخالدي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-29', name: 'سامي البقمي', phone: '+966 55 888 2222', initials: 'س.ب', branch: 'فرع البقمي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-30', name: 'توفيق القاسم', phone: '+966 54 333 7777', initials: 'ت.ق', branch: 'فرع القاسم', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-31', name: 'محسن الرشيدي', phone: '+966 50 666 1111', initials: 'م.ر', branch: 'فرع الرشيدي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-32', name: 'حسن العمري', phone: '+966 56 111 4444', initials: 'ح.ع', branch: 'فرع العمري', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-33', name: 'باسم البلوي', phone: '+966 53 444 2222', initials: 'ب.ب', branch: 'فرع البلوي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-34', name: 'زياد السهلي', phone: '+966 50 777 3333', initials: 'ز.س', branch: 'فرع السهلي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-35', name: 'عماد العصيمي', phone: '+966 55 222 5555', initials: 'ع.ع', branch: 'فرع العصيمي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-36', name: 'خليل الرويلي', phone: '+966 54 888 6666', initials: 'خ.ر', branch: 'فرع الرويلي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-37', name: 'أيمن الحارثي', phone: '+966 50 333 9999', initials: 'أ.ح', branch: 'فرع الحارثي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-38', name: 'عبدالعزيز السالم', phone: '+966 56 999 2222', initials: 'ع.س', branch: 'فرع السالم', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-39', name: 'حاتم الشريف', phone: '+966 53 222 7777', initials: 'ح.ش', branch: 'فرع الشريف', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-40', name: 'جهاد الصبحي', phone: '+966 50 888 4444', initials: 'ج.ص', branch: 'فرع الصبحي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-41', name: 'عصام الغامدي', phone: '+966 55 555 3333', initials: 'ع.غ', branch: 'فرع الغامدي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-42', name: 'فراس الجعيد', phone: '+966 54 111 8888', initials: 'ف.ج', branch: 'فرع الجعيد', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-43', name: 'مصعب الثقفي', phone: '+966 50 444 6666', initials: 'م.ث', branch: 'فرع الثقفي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-44', name: 'باسم الغامدي', phone: '+966 56 666 7777', initials: 'ب.غ', branch: 'فرع الغامدي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-45', name: 'سليمان الفهد', phone: '+966 53 999 5555', initials: 'س.ف', branch: 'فرع الفهد', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-46', name: 'غسان الشمري', phone: '+966 50 222 1111', initials: 'غ.ش', branch: 'فرع الشمري', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-47', name: 'نواف العنزي', phone: '+966 55 777 4444', initials: 'ن.ع', branch: 'فرع العنزي', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
  { id: 'mem-48', name: 'طلال الزهراني', phone: '+966 54 333 2222', initials: 'ط.ز', branch: 'فرع الزهراني', status: 'active', subscriptionAmount: 200, createdAt: '2024-01-01' },
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
    memberName: 'عائلة الصالح',
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
    memberName: 'فهد عبدالله',
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
    memberName: 'محمد العلي',
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
    memberName: 'سالم عبدالله',
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
    memberName: 'سعد المحمد',
    memberId: 'mem-2',
    amount: 400,
    date: '05 مارس 2026',
    isoDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    status: 'completed',
    monthYear: 'فبراير 2026',
    note: 'سداد شهرين',
  }
];
