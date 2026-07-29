import React, { useEffect, useRef, useState, Suspense } from 'react';
import { SignInButton } from '@clerk/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ThreeBackground = React.lazy(() =>
  import('./ThreeBackground').then(m => ({ default: m.ThreeBackground }))
);

const features = [
  {
    icon: 'grid_view',
    title: 'مصفوفة المدفوعات',
    description: 'عرض شهري تفاعلي لحالة اشتراكات جميع الأعضاء مع إمكانية التبديل السريع',
    prominent: true,
  },
  {
    icon: 'bar_chart',
    title: 'لوحة المعلومات',
    description: 'مؤشرات أداء رئيسية ورسم بياني يوضح تطور التحصيلات على مدار السنة',
    prominent: true,
  },
  {
    icon: 'group',
    title: 'إدارة الأعضاء',
    description: 'إضافة وتعديل وأرشفة أعضاء العائلة مع بيانات الاتصال والتاريخ',
  },
  {
    icon: 'history',
    title: 'سجل المدفوعات',
    description: 'تتبع شامل لجميع المعاملات المالية مع إمكانية البحث والفلترة',
  },
];

const steps = [
  { icon: 'person_add', title: 'أضف الأعضاء', description: 'سجّل أعضاء العائلة برقم الهاتف واسمهم الكامل' },
  { icon: 'edit_calendar', title: 'حدد الاشتراكات', description: 'أدخل المبالغ الشهرية وتواريخ الدفع لكل عضو' },
  { icon: 'check_circle', title: 'تتبع المدفوعات', description: 'حدّث حالة الدفع بضغطة واحدة وتابع التحصيلات' },
];

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('.hero-badge, .hero-title, .hero-subtitle, .hero-cta, .hero-mockup, .feature-block, .feature-item, .step-card, .cta-content, .proof-line, .mockup-kpi', { opacity: 1, y: 0, scale: 1, x: 0 });
        gsap.set('.progress-bar-fill', { scaleX: 1 });
        return;
      }

      gsap.from('.hero-badge', { opacity: 0, y: 15, duration: 0.5, ease: 'power3.out' });
      gsap.from('.hero-title', { opacity: 0, y: 25, duration: 0.8, ease: 'power4.out', delay: 0.15 });
      gsap.from('.hero-subtitle', { opacity: 0, y: 15, duration: 0.6, ease: 'power3.out', delay: 0.3 });
      gsap.from('.hero-cta', { opacity: 0, y: 15, duration: 0.5, ease: 'power3.out', delay: 0.45 });
      gsap.from('.hero-mockup', { opacity: 0, y: 30, scale: 0.97, duration: 1, ease: 'power4.out', delay: 0.35 });
      gsap.from('.proof-line', { opacity: 0, y: 10, duration: 0.5, ease: 'power3.out', delay: 0.55 });

      gsap.from('.mockup-kpi', {
        opacity: 0,
        y: 8,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.65,
      });

      gsap.to('.progress-bar-fill', {
        scaleX: 1,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });

      if (navRef.current) {
        gsap.to(navRef.current, {
          borderColor: 'rgba(255,255,255,0.06)',
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: '80px top',
            end: '160px top',
            scrub: true,
          },
        });
      }

      if (heroContentRef.current) {
        gsap.to(heroContentRef.current, {
          opacity: 0.4,
          y: 30,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      gsap.from('.feature-block:nth-child(1)', {
        opacity: 0,
        x: 15,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: featuresRef.current, start: 'top 85%' },
      });

      gsap.from('.feature-block:nth-child(2)', {
        opacity: 0,
        x: -15,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: featuresRef.current, start: 'top 85%' },
      });

      gsap.from('.feature-item', {
        opacity: 0,
        y: 12,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' },
      });

      gsap.from('.step-card', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: stepsRef.current, start: 'top 80%' },
      });

      gsap.from('.cta-content', {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 0.8,
        ease: 'power4.out',
        scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' },
      });
    }, [heroRef, featuresRef]);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-warm-black text-warm-text" dir="rtl">
      {/* Skip to content — visually hidden until focused */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-warm-black focus:rounded-xl focus:text-sm focus:font-semibold">
        تخطى إلى المحتوى الرئيسي
      </a>

      {/* Scroll Progress Bar — RTL-correct right-anchored */}
      <div className="fixed top-0 left-0 right-0 w-full h-[2px] z-50 pointer-events-none">
        <div className="progress-bar-fill h-full bg-gold origin-right scale-x-0" />
      </div>

      {/* Navigation */}
      <nav ref={navRef} className="sticky top-0 z-40 bg-warm-black border-b border-transparent">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-gold text-xl">family_restroom</span>
            </div>
            <div>
                <span className="text-lg font-bold text-warm-text leading-tight">صندوق العائلة</span>
              <p className="text-[10px] text-warm-muted hidden sm:block">نظام إدارة الاشتراكات</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection('features')}
              className="hidden md:block text-sm text-warm-muted hover:text-gold transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-warm-black rounded-md"
            >
              المميزات
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hidden md:block text-sm text-warm-muted hover:text-gold transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-warm-black rounded-md"
            >
              كيف يعمل
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl text-warm-muted hover:text-gold hover:bg-warm-elevated transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-warm-black"
              aria-label="القائمة"
            >
              <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
            <SignInButton mode="modal">
              <button className="bg-gold text-warm-black text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:bg-gold-bright active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-warm-black">
                ابدأ الآن
              </button>
            </SignInButton>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div role="dialog" aria-modal="true" aria-label="القائمة الرئيسية" className="md:hidden border-t border-warm-border/50 bg-warm-surface">
            <div className="px-4 py-3 flex flex-col gap-2">
              <button
                onClick={() => { scrollToSection('features'); setMobileMenuOpen(false); }}
                className="w-full text-right text-sm text-warm-muted hover:text-gold transition-colors duration-200 py-2.5 px-3 rounded-lg hover:bg-warm-elevated cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                المميزات
              </button>
              <button
                onClick={() => { scrollToSection('how-it-works'); setMobileMenuOpen(false); }}
                className="w-full text-right text-sm text-warm-muted hover:text-gold transition-colors duration-200 py-2.5 px-3 rounded-lg hover:bg-warm-elevated cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                كيف يعمل
              </button>
            </div>
          </div>
        )}
      </nav>

      <main id="main-content">

      {/* Hero Section */}
      <section id="hero" ref={heroRef} aria-label="القسم الرئيسي" className="relative overflow-hidden min-h-[70dvh] sm:min-h-[90dvh] flex items-center">
        <div className="absolute inset-0 z-0 hidden md:block">
          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-warm-black/95 via-warm-black/70 to-warm-black" />}>
            <ThreeBackground />
          </Suspense>
        </div>

        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-warm-black/95 via-warm-black/70 to-warm-black pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-l from-warm-black/60 to-transparent pointer-events-none" />

        <div ref={heroContentRef} className="max-w-6xl mx-auto px-4 md:px-8 pt-20 pb-16 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="hero-badge inline-flex items-center gap-2 bg-gold-subtle text-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                <span className="material-symbols-outlined text-sm" aria-hidden="true">verified</span>
                نظام آمن وموثوق لإدارة صندوق العائلة
              </div>

              <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-warm-text leading-tight mb-5 text-balance">
                تتبع اشتراكات العائلة
                <span className="text-gold block mt-2">
                  بسهولة وشفافية
                </span>
              </h1>

              <p className="hero-subtitle text-base md:text-lg text-warm-muted leading-relaxed max-w-lg mb-8 text-pretty">
                لوحة تحكم ذكية تجعل من السهل إدارة مدفوعات الصندوق العائلي،
                متابعة التحصيلات، وضمان الشفافية التامة بين جميع الأعضاء
              </p>

              <div className="hero-cta flex flex-col sm:flex-row items-start gap-3">
                <SignInButton mode="modal">
                  <button className="group w-full sm:w-auto bg-gold text-warm-black font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 hover:bg-gold-bright active:scale-[0.97] text-base cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-warm-black">
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-xl" aria-hidden="true">rocket_launch</span>
                      افتح لوحة التحكم
                    </span>
                  </button>
                </SignInButton>
                <button
                  onClick={() => scrollToSection('features')}
                  className="w-full sm:w-auto bg-warm-elevated text-warm-text font-semibold px-8 py-3.5 rounded-xl border border-warm-border transition-all duration-300 hover:border-gold/20 hover:bg-warm-elevated/80 active:scale-[0.97] text-base cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-warm-black"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-xl" aria-hidden="true">info</span>
                    تعرّف على المزيد
                  </span>
                </button>
              </div>

              <div ref={proofRef} className="proof-line mt-10 flex items-center gap-2 text-warm-muted text-sm">
                <span className="text-gold font-bold">٤٨</span>
                <span>عضوًا يدير اشتراكاتهم الشهرية بشفافية كاملة</span>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="hero-mockup">
              <div
                ref={mockupRef}
                className="rounded-2xl bg-warm-surface border border-warm-border overflow-hidden"
              >
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gold text-sm">family_restroom</span>
                      </div>
                      <span className="text-sm font-bold text-warm-text">لوحة المعلومات</span>
                    </div>
                    <div className="flex gap-2" aria-hidden="true">
                      <div className="w-3 h-3 rounded-full bg-gold" />
                      <div className="w-3 h-3 rounded-full bg-warm-muted/40" />
                      <div className="w-3 h-3 rounded-full bg-warm-red/40" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: 'المحصّل', value: '٩٦,٠٠٠', color: 'text-gold' },
                      { label: 'المستحق', value: '١٢٠,٠٠٠', color: 'text-warm-text' },
                      { label: 'نسبة التحصيل', value: '٨٠%', color: 'text-gold' },
                      { label: 'المتأخر', value: '٨', color: 'text-warm-red' },
                    ].map((kpi, i) => (
                      <div key={i} className="mockup-kpi bg-warm-elevated rounded-xl p-3 border border-warm-border">
                        <p className="text-[10px] text-warm-muted mb-1">{kpi.label}</p>
                        <p className={`text-lg md:text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-warm-elevated rounded-xl border border-warm-border overflow-hidden overflow-x-auto">
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-px bg-warm-border/50 min-w-[280px]">
                      <div className="bg-warm-surface/80 p-2 text-[10px] font-bold text-warm-muted">العضو</div>
                      {['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو'].map((m, idx) => (
                        <div key={m} className={`bg-warm-surface/80 p-2 text-[10px] font-bold text-warm-muted text-center${idx >= 3 ? ' hidden md:block' : ''}`}>{m}</div>
                      ))}
                      {[
                        { name: 'أحمد', months: ['✓', '✓', '✓', '✓', '✓'] },
                        { name: 'سارة', months: ['✓', '✓', '—', '✓', '✓'] },
                        { name: 'محمد', months: ['✓', '—', '—', '✓', '—'] },
                      ].map((row, i) => (
                        <React.Fragment key={i}>
                          <div className="bg-warm-surface/80 p-2 text-[10px] font-bold text-warm-text">{row.name}</div>
                          {row.months.map((status, j) => (
                            <div key={j} className={`bg-warm-surface/80 p-2 text-center text-[10px] font-bold ${status === '✓' ? 'text-gold' : 'text-warm-red'}${j >= 3 ? ' hidden md:block' : ''}`}>
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
        </div>
      </section>

      {/* Features Section */}
      <section id="features" aria-label="المميزات" className="py-20 md:py-28 relative">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <h3 className="text-3xl md:text-4xl font-bold text-warm-text mb-4 text-balance">
              كل ما تحتاجه لإدارة الصندوق
            </h3>
            <p className="text-warm-muted max-w-xl mx-auto text-pretty">
              أدوات متكاملة تجعل من إدارة اشتراكات العائلة تجربة سهلة وشفافة
            </p>
          </div>

          <div ref={featuresRef} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-5">
              {features.filter(f => f.prominent).map((feature, i) => (
                <div key={i} className="feature-block rounded-xl bg-warm-elevated border border-warm-border p-6 md:p-8">
                  <div className="w-12 h-12 mb-5 rounded-xl bg-gold-subtle flex items-center justify-center">
                    <span className="material-symbols-outlined text-gold text-xl" aria-hidden="true">{feature.icon}</span>
                  </div>
                  <h4 className="text-xl font-bold text-warm-text mb-2">{feature.title}</h4>
                  <p className="text-sm text-warm-muted leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {features.filter(f => !f.prominent).map((feature, i) => (
                <div key={i} className="feature-item rounded-xl bg-warm-elevated border border-warm-border p-4 flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-gold-subtle flex items-center justify-center">
                    <span className="material-symbols-outlined text-gold text-lg" aria-hidden="true">{feature.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-warm-text">{feature.title}</h4>
                    <p className="text-xs text-warm-muted mt-0.5">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" aria-label="كيف يعمل" className="py-20 md:py-28 bg-warm-surface/80 border-y border-warm-border/50 relative">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <h3 className="text-3xl md:text-4xl font-bold text-warm-text mb-4 text-balance">
              كيف يعمل النظام؟
            </h3>
            <p className="text-warm-muted max-w-xl mx-auto text-pretty">
              ثلاث خطوات فقط لبدء إدارة صندوق العائلة بكفاءة
            </p>
          </div>

          <div ref={stepsRef} className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="step-card text-center relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-0 w-full h-px bg-gradient-to-l from-warm-border to-transparent -z-0" />
                )}
                <div className="relative z-10 w-16 h-16 rounded-full bg-warm-elevated border border-warm-border flex items-center justify-center mx-auto mb-5">
                  <span className="material-symbols-outlined text-gold text-2xl" aria-hidden="true">{step.icon}</span>
                </div>
                <h4 className="text-lg font-bold text-warm-text mb-2">{step.title}</h4>
                <p className="text-sm text-warm-muted leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="cta-content relative rounded-2xl p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold via-gold-bright to-gold-deep" />
            <div className="absolute inset-0 bg-gradient-to-tr from-gold-deep/30 via-transparent to-warm-black/10" />

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-warm-black mb-4 text-balance">
                ابدأ إدارة صندوق عائلتك الآن
              </h3>
              <p className="text-warm-black max-w-lg mx-auto mb-8 text-base md:text-lg text-pretty">
                وفّر وقتك وجهدك في تتبع المدفوعات. احصل على لوحة تحكم شاملة
                تضمن الشفافية والدقة في إدارة اشتراكات العائلة
              </p>

              <SignInButton mode="modal">
                <button className="group bg-warm-black text-gold-bright font-bold px-10 py-4 rounded-xl transition-all duration-300 hover:bg-warm-elevated active:scale-[0.97] text-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-text focus-visible:ring-offset-2 focus-visible:ring-offset-gold-deep">
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-xl" aria-hidden="true">rocket_launch</span>
                    افتح لوحة التحكم
                  </span>
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-warm-border/50 bg-warm-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-gold text-sm">family_restroom</span>
              </div>
              <span className="text-sm font-bold text-warm-text">صندوق العائلة</span>
            </div>
            <p className="text-xs text-warm-muted">
              نظام إدارة اشتراكات الصندوق العائلي — جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
