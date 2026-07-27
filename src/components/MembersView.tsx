import React, { useState } from 'react';
import { useFund } from '../context/FundContext';
import { Member } from '../types';

interface MembersViewProps {
  onOpenAddMember: () => void;
  onEditMember: (member: Member) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({ onOpenAddMember, onEditMember }) => {
  const { members, toggleMemberArchive } = useFund();
  const [search, setSearch] = useState('');
  const [tabFilter, setTabFilter] = useState<'active' | 'archived' | 'all'>('active');

  const filteredMembers = members.filter(member => {
    const matchesTab = tabFilter === 'all' ? true : member.status === tabFilter;
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
                          member.phone.includes(search) ||
                          (member.branch && member.branch.includes(search));
    return matchesTab && matchesSearch;
  });

  const activeCount = members.filter(m => m.status === 'active').length;
  const archivedCount = members.filter(m => m.status === 'archived').length;

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header & Main Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#154212]">إدارة الأعضاء</h1>
          <p className="text-sm text-[#42493e] mt-1">
            إجمالي الأعضاء المسجلين: <strong className="text-[#154212] font-bold">{members.length}</strong> (نشط: {activeCount} | مؤرشف: {archivedCount})
          </p>
        </div>

        <button
          onClick={onOpenAddMember}
          className="bg-[#154212] hover:bg-[#2d5a27] text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>إضافة عضو جديد</span>
        </button>
      </div>

      {/* Filter / Search Bar & Status Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-[#eff4ff] p-3 rounded-xl border border-[#e2e8f0]">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#72796e]">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="البحث بالاسم، رقم الهاتف، أو فرع العائلة..."
            className="w-full bg-white border border-[#c2c9bb] text-sm text-[#0b1c30] rounded-lg py-2 pr-10 pl-4 focus:ring-2 focus:ring-[#154212] focus:border-[#154212] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#c2c9bb]">
          <button
            onClick={() => setTabFilter('active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              tabFilter === 'active' ? 'bg-[#154212] text-white' : 'text-[#42493e] hover:bg-[#f8f9ff]'
            }`}
          >
            الاعضاء النشطين ({activeCount})
          </button>
          <button
            onClick={() => setTabFilter('archived')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              tabFilter === 'archived' ? 'bg-[#154212] text-white' : 'text-[#42493e] hover:bg-[#f8f9ff]'
            }`}
          >
            المؤرشفين ({archivedCount})
          </button>
          <button
            onClick={() => setTabFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              tabFilter === 'all' ? 'bg-[#154212] text-white' : 'text-[#42493e] hover:bg-[#f8f9ff]'
            }`}
          >
            الكل ({members.length})
          </button>
        </div>
      </div>

      {/* Members Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-[#e2e8f0] text-[#72796e]">
            لا يوجد أعضاء يطابقون خيارات البحث.
          </div>
        ) : (
          filteredMembers.map(member => {
            const isActive = member.status === 'active';

            return (
              <div
                key={member.id}
                className={`bg-white rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 hover:shadow-md relative overflow-hidden ${
                  isActive ? 'border-[#e2e8f0]' : 'border-[#c2c9bb] bg-[#f8f9ff]/70'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        isActive ? 'bg-[#e5eeff] text-[#154212]' : 'bg-[#c2c9bb] text-[#42493e]'
                      }`}>
                        {member.initials || member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#0b1c30]">{member.name}</h3>
                        <p className="text-xs text-[#72796e] font-mono dir-ltr text-right">{member.phone}</p>
                        {member.branch && (
                          <span className="inline-block text-[10px] text-[#42493e] bg-[#eff4ff] px-2 py-0.5 rounded mt-1">
                            {member.branch}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isActive ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-[#fee2e2] text-[#991b1b]'
                    }`}>
                      {isActive ? 'نشط' : 'مؤرشف'}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#e2e8f0]">
                  {isActive ? (
                    <>
                      <button
                        onClick={() => onEditMember(member)}
                        className="flex-1 bg-white border border-[#154212] text-[#154212] hover:bg-[#eff4ff] text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        تعديل
                      </button>

                      <button
                        onClick={() => toggleMemberArchive(member.id)}
                        className="flex-1 bg-white border border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ffdad6] text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">archive</span>
                        أرشفة
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => toggleMemberArchive(member.id)}
                      className="w-full bg-[#154212] text-white hover:bg-[#2d5a27] text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
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
