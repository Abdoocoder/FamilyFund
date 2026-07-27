import React, { useState, useRef, useEffect } from 'react';
import { useFund } from '../context/FundContext';
import { Member } from '../types';
import gsap from 'gsap';

interface MembersViewProps {
  onOpenAddMember: () => void;
  onEditMember: (member: Member) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({ onOpenAddMember, onEditMember }) => {
  const { members, toggleMemberArchive } = useFund();
  const [search, setSearch] = useState('');
  const [tabFilter, setTabFilter] = useState<'active' | 'archived' | 'all'>('active');

  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const filteredMembers = members.filter(member => {
    const matchesTab = tabFilter === 'all' ? true : member.status === tabFilter;
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
                          member.phone.includes(search) ||
                          (member.branch && member.branch.includes(search));
    return matchesTab && matchesSearch;
  });

  const activeCount = members.filter(m => m.status === 'active').length;
  const archivedCount = members.filter(m => m.status === 'archived').length;

  // GSAP stagger on cards
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: 'power3.out',
      });

      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          opacity: 0,
          y: 20,
          scale: 0.97,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power3.out',
          delay: 0.2,
        });
      }
    });
    return () => ctx.revert();
  }, [tabFilter, search]);

  const filterTabs = [
    { id: 'active' as const, label: 'الاعضاء النشطين', count: activeCount },
    { id: 'archived' as const, label: 'المؤرشفين', count: archivedCount },
    { id: 'all' as const, label: 'الكل', count: members.length },
  ];

  return (
    <div className="space-y-5 pb-24 md:pb-8">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 surface-elevated p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-fund-text tracking-tight">إدارة الأعضاء</h1>
          <p className="text-sm text-fund-muted mt-1.5 tracking-wide">
            إجمالي الأعضاء المسجلين:{' '}
            <strong className="text-fund-green font-bold">{members.length}</strong>{' '}
            (نشط: {activeCount} | مؤرشف: {archivedCount})
          </p>
        </div>

        <button
          onClick={onOpenAddMember}
          className="bg-fund-green hover:bg-fund-green-light text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md hover:shadow-fund-green/15 active:scale-[0.97] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>إضافة عضو جديد</span>
        </button>
      </div>

      {/* Search & Filter Tabs */}
      <div className="glass p-3 rounded-2xl border border-white/20 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-fund-muted">
            <span className="material-symbols-outlined text-lg">search</span>
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="البحث بالاسم، رقم الهاتف، أو فرع العائلة..."
            className="w-full bg-white border border-fund-border/60 text-sm text-fund-text rounded-xl py-2.5 pr-10 pl-4 focus:ring-2 focus:ring-fund-green/20 focus:border-fund-green transition-all placeholder-fund-muted/60 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-fund-border/40 shadow-sm">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setTabFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                tabFilter === tab.id
                  ? 'bg-fund-green text-white shadow-sm shadow-fund-green/20'
                  : 'text-fund-muted hover:bg-fund-accent'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Members Cards Grid */}
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full py-16 text-center surface-elevated rounded-2xl">
            <span className="material-symbols-outlined text-5xl text-fund-border block mb-3">group_off</span>
            <p className="text-fund-muted">لا يوجد أعضاء يطابقون خيارات البحث.</p>
          </div>
        ) : (
          filteredMembers.map(member => {
            const isActive = member.status === 'active';

            return (
              <div
                key={member.id}
                className={`surface-elevated rounded-2xl p-5 flex flex-col justify-between hover-lift group relative overflow-hidden ${
                  !isActive ? 'bg-fund-surface/70 opacity-80' : ''
                }`}
              >
                {/* Subtle ambient gradient on active cards */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-fund-accent/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 ${
                        isActive ? 'bg-fund-accent text-fund-green' : 'bg-fund-border/40 text-fund-muted'
                      }`}>
                        {member.initials || member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm md:text-base font-bold text-fund-text tracking-wide">{member.name}</h3>
                        <p className="text-xs text-fund-muted font-mono dir-ltr text-right">{member.phone}</p>
                        {member.branch && (
                          <span className="inline-block text-[10px] text-fund-muted bg-fund-accent/60 px-2 py-0.5 rounded-md mt-1 tracking-wide">
                            {member.branch}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      isActive ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-[#fee2e2] text-[#991b1b]'
                    }`}>
                      {isActive ? 'نشط' : 'مؤرشف'}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-fund-border/40 relative z-10">
                  {isActive ? (
                    <>
                      <button
                        onClick={() => onEditMember(member)}
                        className="flex-1 bg-white border border-fund-green/30 text-fund-green hover:bg-fund-accent text-xs font-bold py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer active:scale-[0.97]"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        تعديل
                      </button>
                      <button
                        onClick={() => toggleMemberArchive(member.id)}
                        className="flex-1 bg-white border border-[#ba1a1a]/30 text-[#ba1a1a] hover:bg-[#ffdad6] text-xs font-bold py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer active:scale-[0.97]"
                      >
                        <span className="material-symbols-outlined text-[16px]">archive</span>
                        أرشفة
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => toggleMemberArchive(member.id)}
                      className="w-full bg-fund-green text-white hover:bg-fund-green-light text-xs font-bold py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer active:scale-[0.97]"
                    >
                      <span className="material-symbols-outlined text-[16px]">unarchive</span>
                      استعادة العضو
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
