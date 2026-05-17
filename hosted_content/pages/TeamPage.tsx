import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../App';

export const teamData = [
  { id: 'tea-gotsiridze', name: { ka: 'თეა გოცირიძე', en: 'Tea Gotsiridze' }, role: { ka: 'კლინიკის ხელმძღვანელი / იმპლანტოლოგი', en: 'Clinic Head / Implantologist' }, image: 'https://framerusercontent.com/images/NL9ZihxOkco4TeWtDDi8fz20.jpg', isActive: true },
  { id: 'giorgi-beridze', name: { ka: 'გიორგი ბერიძე', en: 'Giorgi Beridze' }, role: { ka: 'თერაპევტი / ორთოდონტი', en: 'Therapist / Orthodontist' }, image: 'https://framerusercontent.com/images/Es82GeniQfvbrLe8GIg5ctOEq6M.jpg', isActive: true },
  { id: 'nino-kapanadze', name: { ka: 'ნინო კაპანაძე', en: 'Nino Kapanadze' }, role: { ka: 'ბავშვთა სტომატოლოგი', en: 'Pediatric Dentist' }, image: 'https://framerusercontent.com/images/0JhnuSVKqzhBvoFbmldufpEA.jpg', isActive: true },
  { id: 'david-makharadze', name: { ka: 'დავით მახარაძე', en: 'David Makharadze' }, role: { ka: 'ყბა-სახის ქირურგი', en: 'Maxillofacial Surgeon' }, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800', isActive: true },
];

const TeamPage: React.FC = () => {
  const context = useContext(LanguageContext);
  const [activeCategory, setActiveCategory] = useState<'doctor' | 'assistant' | 'administration'>('doctor');
  
  if (!context) return null;
  const { lang, siteData, team } = context;
  const t = siteData[lang];

  const filteredTeam = team.filter(m => {
    if (activeCategory === 'doctor') return m.type === 'doctor' || !m.type;
    if (activeCategory === 'assistant') return m.type === 'assistant';
    return m.type === 'administration';
  });

  return (
    <div className="py-12 md:py-24 px-4 md:px-10 max-w-[1440px] mx-auto bg-white min-h-screen">
      <div className="text-center mb-8 md:mb-16">
        <h1 className="text-3xl md:text-8xl font-bold text-gray-900 uppercase mb-4 tracking-tighter">{t.teamPage.title}</h1>
        <p className="text-xs md:text-xl text-[#005a5a] max-w-2xl mx-auto font-bold uppercase tracking-widest px-4">{t.teamPage.subtitle}</p>
      </div>

      {/* Category Toggle */}
      <div className="flex justify-start md:justify-center mb-10 md:mb-16 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="inline-flex p-1 bg-gray-100 rounded-full whitespace-nowrap min-w-max">
          <button 
            onClick={() => setActiveCategory('doctor')}
            className={`px-5 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === 'doctor' ? 'bg-white text-[#005a5a] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {lang === 'ka' ? 'ექიმები' : 'Doctors'}
          </button>
          <button 
            onClick={() => setActiveCategory('assistant')}
            className={`px-5 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === 'assistant' ? 'bg-white text-[#005a5a] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {lang === 'ka' ? 'ასისტენტები' : 'Assistants'}
          </button>
          <button 
            onClick={() => setActiveCategory('administration')}
            className={`px-5 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === 'administration' ? 'bg-white text-[#005a5a] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {lang === 'ka' ? 'ადმინისტრაცია' : 'Administration'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {filteredTeam.map((member) => (
          <Link key={member.id} to={`/team/${member.id}`} className="group block">
            <div className="relative h-[220px] md:h-[400px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-3 md:mb-4 shadow-sm group-hover:shadow-2xl transition-all duration-500">
              <img 
                src={member.image} 
                alt={member.name[lang]} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-700" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="px-1 md:px-2 text-center">
              <h3 className="text-sm md:text-xl font-bold text-gray-900 uppercase group-hover:text-[#005a5a] transition-colors line-clamp-2">{member.name[lang]}</h3>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredTeam.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
            {lang === 'ka' ? 'ამ კატეგორიაში წევრები არ მოიძებნა' : 'No members found in this category'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamPage;