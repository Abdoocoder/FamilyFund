import React, { useEffect, useRef } from 'react';
import { SignInButton } from '@clerk/react';
import gsap from 'gsap';

interface LandingPageProps {}

const features = [
  {
    icon: 'grid_view',
    title: 'مصفوفة المدفوعات',
    description: 'عرض شهري تفاعلي لحالة اشتراكات جميع الأعضاء مع إمكانية التبديل السريع',
  },
  {
    icon: 'group',
    title: 'إدارة الأعضاء',
    description: 'إضافة وتعديل و أرشفة أعضاء العائلة مع بيانات الاتصال والتاريخ',
  },
  {
    icon: 'bar_chart',
    title: 'لوحة معلومات',
    description: 'مؤشرات أداء رئيسية ورسم بياني يوضح تطور التحصيلات على مدار السنة',
  },
  {
    icon: 'history',
    title: 'سجل المدفوعات',
    description: 'تتبع شامل لجميع المعاملات المالية مع إمكانية البحث والفلترة',
  },
  {
    icon: 'receipt_long',
    title: 'سجل التدقيق',
    description: 'توثيق تلقائي لكل عملية لتغيير لضمان الشفافية والمساءلة',
  },
  {
    icon: 'download',
    title: 'تصدير البيانات',
    description: 'تصدير سجلات الدفع والبيانات بصيغة CSV للتحليل أو الطباعة',
  },
];

const steps = [
  {
    number: '01',
    icon: 'person_add',
    title: 'أضف الأعضاء',
    description: 'سجّل أعضاء العائلة برقم الهاتف واسمهم الكامل',
  },
  {
    number: '02',
    icon: 'edit_calendar',
    title: 'حدد الاشتراكات',
    description: 'أدخل المبالغ الشهرية وتواريخ الدفع لكل عضو',
  },
  {
    number: '03',
    icon: 'check_circle',
    title: 'تتبع المدفوعات',
    description: 'حدّث حالة الدفع بضغطة واحدة وتابع التحصيلات',
  },
];

const stats = [
  { value: '٤٨', label: 'عضو نشط' },
  { value: '١٢', label: 'شهر مالي' },
  { value: '١٠٠%', label: 'شفافية' },
  { value: '٢٤/٧', label: 'وصول دائم' },
];

export const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from('.hero-badge', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
      });
      gsap.from('.hero-title', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.15,
      });
      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.3,
      });
      gsap.from('.hero-cta', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.45,
      });
      gsap.from('.hero-visual', {
        opacity: 0,
        scale: 0.95,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.3,
      });

      // Stats stagger
      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          opacity: 0,
          y: 24,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.6,
        });
      }

      // Features stagger on scroll
      const featureCards = featuresRef.current?.querySelectorAll('.feature-card');
      if (featureCards) {
        gsap.from(featureCards, {
          opacity: 0,
          y: 30,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
          },
        });
      }

      // Steps stagger
      const stepCards = stepsRef.current?.querySelectorAll('.step-card');
      if (stepCards) {
        gsap.from(stepCards, {
          opacity: 0,
          x: -30,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 80%',
          },
        });
      }

      // CTA
      gsap.from('.cta-content', {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 80%',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-fund-surface" dir="rtl">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-fund-border/40">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fund-green to-fund-green-light flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white text-xl">family_restroom</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-fund-green leading-tight">صندوق العائلة</h1>
              <p className="text-[10px] text-fund-muted hidden sm:block">نظام إدارة الاشتراكات</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection('features')}
              className="hidden md:block text-sm text-fund-muted hover:text-fund-green transition-colors duration-200 cursor-pointer"
            >
              المميزات
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hidden md:block text-sm text-fund-muted hover:text-fund-green transition-colors duration-200 cursor-pointer"
            >
              كيف يعمل
            </button>
            <SignInButton mode="modal">
              <button className="bg-fund-green hover:bg-fund-green-light text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-fund-green/10 active:scale-[0.97] cursor-pointer">
                ابدأ الآن
              </button>
            </SignInButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-fund-accent/60 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-12 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="hero-badge inline-flex items-center gap-2 bg-fund-green/8 text-fund-green text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-fund-green/10">
              <span className="material-symbols-outlined text-sm">verified</span>
              نظام آمن وموثوق لإدارة صندوق العائلة
            </div>

            <h2 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-fund-text leading-tight mb-5">
              تتبع اشتراكات العائلة
              <span className="text-fund-green block mt-2">بسهولة وشفافية</span>
            </h2>

            <p className="hero-subtitle text-base md:text-lg text-fund-muted leading-relaxed max-w-2xl mx-auto mb-8">
              لوحة تحكم ذكية تجعل من السهل إدارة مدفوعات الصندوق العائلي،
              متابعة التحصيلات، وضمان الشفافية التامة بين جميع الأعضاء
            </p>

            <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-3">
              <SignInButton mode="modal">
                <button className="w-full sm:w-auto bg-fund-green hover:bg-fund-green-light text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-fund-green/15 active:scale-[0.97] text-base cursor-pointer">
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-xl">rocket_launch</span>
                    افتح لوحة التحكم
                  </span>
                </button>
              </SignInButton>
              <button
                onClick={() => scrollToSection('features')}
                className="w-full sm:w-auto bg-white hover:bg-fund-accent text-fund-text font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 border border-fund-border/60 hover:border-fund-green/20 active:scale-[0.97] text-base cursor-pointer"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-xl">info</span>
                  تعرّف على المزيد
                </span>
              </button>
            </div>
          </div>

          {/* Hero Visual - Dashboard Preview */}
          <div className="hero-visual mt-14 md:mt-20 max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-fund-green/8 border border-fund-border/40">
              <div className="bg-white p-4 md:p-6">
                {/* Mock Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fund-green to-fund-green-light flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-sm">family_restroom</span>
                    </div>
                    <span className="text-sm font-bold text-fund-green">لوحة المعلومات</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                  </div>
                </div>

                {/* Mock KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'المحصّل', value: '٩٦,٠٠٠', color: 'text-fund-green' },
                    { label: 'المستحق', value: '١٢٠,٠٠٠', color: 'text-fund-text' },
                    { label: 'نسبة التحصيل', value: '٨٠%', color: 'text-fund-green' },
                    { label: 'المتأخر', value: '٨', color: 'text-status-danger' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-fund-surface rounded-xl p-3 border border-fund-border/40">
                      <p className="text-[10px] text-fund-muted mb-1">{kpi.label}</p>
                      <p className={`text-lg md:text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
                    </div>
                  ))}
                </div>

                {/* Mock Payment Matrix */}
                <div className="bg-fund-surface rounded-xl border border-fund-border/40 overflow-hidden">
                  <div className="grid grid-cols-6 gap-px bg-fund-border/20">
                    <div className="bg-white p-2 text-[10px] font-bold text-fund-muted">العضو</div>
                    {['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو'].map((m) => (
                      <div key={m} className="bg-white p-2 text-[10px] font-bold text-fund-muted text-center">{m}</div>
                    ))}
                    {[
                      { name: 'أحمد', months: ['✓', '✓', '✓', '✓', '✓'] },
                      { name: 'سارة', months: ['✓', '✓', '—', '✓', '✓'] },
                      { name: 'محمد', months: ['✓', '—', '—', '✓', '—'] },
                    ].map((row, i) => (
                      <React.Fragment key={i}>
                        <div className="bg-white p-2 text-[10px] font-bold text-fund-text">{row.name}</div>
                        {row.months.map((status, j) => (
                          <div key={j} className={`bg-white p-2 text-center text-[10px] font-bold ${status === '✓' ? 'text-status-paid' : 'text-status-danger'}`}>
                            {status}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-fund-border/40 bg-white">
        <div ref={statsRef} className="max-w-6xl mx-auto px-4 md:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-fund-green">{stat.value}</p>
              <p className="text-sm text-fund-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-fund-green text-xs font-semibold bg-fund-green/8 px-3 py-1 rounded-full mb-4 border border-fund-green/10">
              <span className="material-symbols-outlined text-sm">star</span>
              المميزات
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-fund-text mb-4">
              كل ما تحتاجه لإدارة الصندوق
            </h3>
            <p className="text-fund-muted max-w-xl mx-auto">
              أدوات متكاملة تجعل من إدارة اشتراكات العائلة تجربة سهلة وشفافة
            </p>
          </div>

          <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="feature-card group bg-white rounded-2xl p-6 border border-fund-border/40 hover:border-fund-green/20 transition-all duration-300 hover:shadow-lg hover:shadow-fund-green/5 cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-fund-green/8 flex items-center justify-center mb-4 group-hover:bg-fund-green/12 transition-colors duration-300">
                  <span className="material-symbols-outlined text-fund-green text-xl">{feature.icon}</span>
                </div>
                <h4 className="text-lg font-bold text-fund-text mb-2">{feature.title}</h4>
                <p className="text-sm text-fund-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white border-y border-fund-border/40">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-fund-green text-xs font-semibold bg-fund-green/8 px-3 py-1 rounded-full mb-4 border border-fund-green/10">
              <span className="material-symbols-outlined text-sm">route</span>
              خطوات بسيطة
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-fund-text mb-4">
              كيف يعمل النظام؟
            </h3>
            <p className="text-fund-muted max-w-xl mx-auto">
              ثلاث خطوات فقط لبدء إدارة صندوق العائلة بكفاءة
            </p>
          </div>

          <div ref={stepsRef} className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div
                key={i}
                className="step-card relative text-center p-6"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-l from-fund-green/20 to-transparent -z-0" />
                )}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-fund-green/8 flex items-center justify-center mx-auto mb-5">
                  <span className="material-symbols-outlined text-fund-green text-2xl">{step.icon}</span>
                </div>
                <span className="inline-block text-xs font-bold text-fund-green/40 mb-2">{step.number}</span>
                <h4 className="text-lg font-bold text-fund-text mb-2">{step.title}</h4>
                <p className="text-sm text-fund-muted leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="cta-content bg-gradient-to-br from-fund-green to-fund-green-light rounded-3xl p-8 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ابدأ إدارة صندوق عائلتك الآن
              </h3>
              <p className="text-white/80 max-w-lg mx-auto mb-8 text-base md:text-lg">
                وفّر وقتك وجهدك في تتبع المدفوعات. احصل على لوحة تحكم شاملة
                تضمن الشفافية والدقة في إدارة اشتراكات العائلة
              </p>

              <SignInButton mode="modal">
                <button className="bg-white text-fund-green font-bold px-10 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.97] text-lg cursor-pointer hover:bg-fund-surface">
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                    افتح التطبيق
                  </span>
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-fund-border/40 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fund-green to-fund-green-light flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">family_restroom</span>
              </div>
              <span className="text-sm font-bold text-fund-green">صندوق العائلة</span>
            </div>
            <p className="text-xs text-fund-muted">
              نظام إدارة اشتراكات الصندوق العائلي — جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
