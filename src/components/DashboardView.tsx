import React, { useState, useRef, useEffect } from 'react';
import { useFund } from '../context/FundContext';
import { ARABIC_MONTHS } from '../data/initialMembers';
import gsap from 'gsap';

export const DashboardView: React.FC = () => {
  const { getYearStats, transactions, selectedYear, setSelectedYear, payments, setActiveTab } = useFund();
  const [chartYear, setChartYear] = useState<number>(selectedYear);

  const stats = getYearStats(chartYear);

  const kpiRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  const formatAmount = (num: number) => {
    return num.toLocaleString('ar-JO');
  };

  const monthlyTotals = React.useMemo(() =>
    Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthPayments = payments.filter(p => p.year === chartYear && p.month === month && p.status === 'paid');
      return monthPayments.reduce((sum, p) => sum + (p.amount || 200), 0);
    }),
    [payments, chartYear]
  );

  const maxMonthVal = Math.max(...monthlyTotals, 10000);

  // GSAP staggered entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(welcomeRef.current, { opacity: 1, y: 0 });
        gsap.set(chartRef.current, { opacity: 1, y: 0 });
        return;
      }
      gsap.from(welcomeRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
      });

      if (kpiRef.current) {
        gsap.from(kpiRef.current.children, {
          opacity: 0,
          y: 24,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.15,
        });
      }

      gsap.from(chartRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.4,
      });

      if (barsRef.current) {
        gsap.from(barsRef.current.querySelectorAll('.chart-bar'), {
          scaleY: 0,
          transformOrigin: 'bottom',
          duration: 0.8,
          stagger: 0.04,
          ease: 'power3.out',
          delay: 0.6,
        });
      }
    });

    return () => ctx.revert();
  }, [chartYear]);

  interface KpiCard { label: string; value: string; suffix: string; sub: string | null; icon: string; iconBg: string; valueClass: string; isFeatured?: boolean; }
  const kpiCards: KpiCard[] = [
    {
      label: 'إجمالي المتوقع',
      value: formatAmount(stats.expected),
      suffix: 'د.أ',
      sub: 'سنوياً',
      icon: 'account_balance',
      iconBg: 'bg-primary-subtle text-primary',
      valueClass: 'text-foreground',
    },
    {
      label: 'إجمالي المحصل',
      value: formatAmount(stats.collected),
      suffix: 'د.أ',
      sub: 'حتى الآن',
      icon: 'savings',
      iconBg: 'bg-success-bg text-success',
      valueClass: 'text-success',
    },
    {
      label: 'المبلغ المتبقي',
      value: formatAmount(stats.remaining),
      suffix: 'د.أ',
      sub: 'مستحق',
      icon: 'pending_actions',
      iconBg: 'bg-danger-bg text-danger',
      valueClass: 'text-danger',
    },
    {
      label: 'نسبة الالتزام',
      value: `%${stats.complianceRate}`,
      suffix: '',
      sub: null,
      icon: 'trending_up',
      iconBg: 'bg-surface-elevated/20 text-white',
      valueClass: 'text-white',
      isFeatured: true,
    },
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Welcome Header */}
      <section ref={welcomeRef} className="relative bg-surface-elevated rounded-2xl overflow-hidden shadow-sm border border-border/40">
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary/30 rounded-r-lg" />
        <div className="p-6 md:p-8 pr-7 md:pr-9">
          <h2 className="text-2xl md:text-3xl text-foreground font-bold tracking-tight" style={{ textWrap: 'balance' }}>
            مرحباً بعودتك، المحاسب
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1.5 tracking-wide">
            إليك نظرة عامة على حالة الصندوق واشتراكات الأعضاء لعام {chartYear}.
          </p>
        </div>
      </section>

      {/* KPI Cards Section */}
      <section ref={kpiRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl p-5 flex flex-col justify-between cursor-default border transition-shadow duration-300 ${
              card.isFeatured
                ? 'bg-gradient-to-br from-primary to-primary-dark text-white border-primary shadow-md shadow-primary/15'
                : 'bg-surface-elevated border-border/60 hover:shadow-md hover:shadow-black/5'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs md:text-sm font-medium tracking-wide ${card.isFeatured ? 'text-white/80' : 'text-muted-foreground'}`}>{card.label}</span>
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shadow-sm`}>
                <span className="material-symbols-outlined text-lg">{card.icon}</span>
              </div>
            </div>
            <div>
              <div className={`text-2xl md:text-3xl ${card.valueClass} font-bold tabular-nums tracking-tight`}>
                {card.value}
                {card.suffix && <span className={`text-sm font-normal mr-1 ${card.isFeatured ? 'text-white/70' : 'text-muted-foreground'}`}>{card.suffix}</span>}
              </div>
              {card.sub && (
                <div className={`text-[11px] mt-1 tracking-wide ${card.isFeatured ? 'text-white/60' : 'text-muted-foreground'}`}>{card.sub}</div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Grid: Chart & Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div ref={chartRef} className="lg:col-span-2 bg-surface-elevated rounded-2xl p-6 border border-border/60 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-foreground tracking-tight" style={{ textWrap: 'balance' }}>تقدم التحصيل الشهري</h3>
            <div className="flex items-center gap-1.5 bg-muted-surface/60 p-1 rounded-xl">
              {[2024, 2025, 2026].map(yr => (
                <button
                  key={yr}
                  onClick={() => {
                    setChartYear(yr);
                    setSelectedYear(yr);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                    chartYear === yr
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'text-muted-foreground hover:bg-surface-elevated/60'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div ref={barsRef} className="flex-grow flex items-end justify-between gap-1.5 pt-6 h-[240px] border-b border-border/60 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 opacity-20">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border-t border-dashed border-border w-full" />
              ))}
            </div>

            {ARABIC_MONTHS.map((monthName, i) => {
              const amount = monthlyTotals[i];
              const heightPct = maxMonthVal > 0 ? Math.min(Math.round((amount / maxMonthVal) * 100), 100) : 0;
              const hasData = amount > 0;

              return (
                <div key={monthName} className="w-full flex flex-col items-center gap-2 relative z-10 group">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out bg-foreground text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-20 scale-95 group-hover:scale-100">
                    {amount.toLocaleString('ar-JO')} د.أ
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                  </div>

                    <div className="w-full max-w-[28px] bg-primary-subtle/70 rounded-lg h-full flex items-end overflow-hidden">
                    <div
                      className={`chart-bar w-full rounded-t-md transition-all duration-700 ${
                        hasData
                          ? 'bg-primary'
                          : 'bg-border/50'
                      }`}
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate max-w-full font-medium tracking-tight">
                    {monthName}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="tracking-wide">
              إجمالي تحصيل العام:{' '}
              <strong className="text-primary font-bold">{formatAmount(stats.collected)} د.أ</strong>
            </span>
            <span className="tracking-wide">الهدف السنوي: {formatAmount(stats.expected)} د.أ</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface-elevated rounded-2xl p-6 border border-border/60 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold text-foreground tracking-tight" style={{ textWrap: 'balance' }}>أحدث العمليات</h3>
            <button
              onClick={() => setActiveTab('history')}
              className="text-primary text-xs font-bold hover:bg-primary-subtle px-3 py-1.5 rounded-lg transition-colors duration-300 flex items-center gap-1 hover:gap-2"
            >
              <span>عرض الكل</span>
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {transactions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                <span className="material-symbols-outlined text-4xl text-border mb-3">receipt_long</span>
                <p className="text-sm text-muted-foreground">لا توجد عمليات مسجلة بعد</p>
                <p className="text-xs text-muted-foreground/60 mt-1">قم بتسجيل دفعة جديدة لظهورها هنا</p>
              </div>
            ) : (
              transactions.slice(0, 5).map((tx, idx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-subtle/40 transition-all duration-300 group cursor-default"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  tx.status === 'completed' ? 'bg-success-bg text-success' :
                   tx.status === 'processing' ? 'bg-warning-bg text-warning' :
                   'bg-danger-bg text-danger'
                }`}>
                  <span className="material-symbols-outlined text-lg">
                    {tx.status === 'completed' ? 'check_circle' : tx.status === 'processing' ? 'schedule' : 'error'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-foreground truncate tracking-wide">{tx.memberName}</p>
                    <p className="text-xs font-bold text-primary tabular-nums shrink-0 mr-2">
                      {tx.amount.toLocaleString('ar-JO')} د.أ
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <p className="text-[11px] text-muted-foreground truncate">{tx.monthYear}</p>
                    <p className="text-[10px] text-muted-foreground shrink-0 mr-2">{tx.date}</p>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>
      </section>
    </div>
  );
};
