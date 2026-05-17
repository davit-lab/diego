
import React, { useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';

const TeamMemberPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useContext(LanguageContext);
  
  if (!context) return null;
  const { lang, team } = context;
  const member = team.find(m => m.id === id);

  const [imgSrc, setImgSrc] = React.useState(member?.image || '');
  const fallbackImage = 'https://images.unsplash.com/photo-1588776814546-1ffce47267a5?auto=format&fit=crop&q=80&w=800';

  useEffect(() => {
    window.scrollTo(0, 0);
    if (member) setImgSrc(member.image);
  }, [id, member]);

  if (!member) return null;

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10">
        <button onClick={() => navigate('/team')} className="flex items-center gap-3 text-gray-400 hover:text-[#005a5a] font-bold uppercase text-xs tracking-widest transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          {lang === 'ka' ? 'ყველა წევრი' : 'All members'}
        </button>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 grid lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-5">
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
            <img 
              src={imgSrc} 
              alt={member.name[lang]} 
              className="w-full aspect-[4/5] object-cover" 
              referrerPolicy="no-referrer"
              onError={() => setImgSrc(fallbackImage)}
            />
          </div>
        </div>

        <div className="lg:col-span-7 pt-4 md:pt-8">
          <span className="text-[#005a5a] font-bold uppercase tracking-[0.3em] text-xs md:text-sm block mb-4">{lang === 'ka' ? 'პროფესიონალი' : 'Professional'}</span>
          <h1 className="text-3xl md:text-7xl font-bold text-gray-900 uppercase tracking-tighter mb-8 md:mb-12 leading-none">{member.name[lang]}</h1>

          <div className="space-y-8 md:space-y-12 max-w-3xl">
            {member.bio?.[lang] && (
              <div>
                <h4 className="text-[#005a5a] font-bold uppercase text-[10px] md:text-xs tracking-widest mb-4 md:mb-6 border-b border-[#005a5a]/10 pb-2">{lang === 'ka' ? 'მოკლე მიმოხილვა' : 'Brief Overview'}</h4>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium whitespace-pre-line">{member.bio[lang]}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
              {member.education?.[lang] && (
                <div>
                  <h4 className="text-[#005a5a] font-bold uppercase text-[10px] md:text-xs tracking-widest mb-4 md:mb-6 border-b border-[#005a5a]/10 pb-2">{lang === 'ka' ? 'განათლება' : 'Education'}</h4>
                  <p className="text-sm md:text-base text-gray-600 font-medium whitespace-pre-line">{member.education[lang]}</p>
                </div>
              )}
              {member.specialization?.[lang] && (
                <div>
                  <h4 className="text-[#005a5a] font-bold uppercase text-[10px] md:text-xs tracking-widest mb-4 md:mb-6 border-b border-[#005a5a]/10 pb-2">{lang === 'ka' ? 'სპეციალიზაცია' : 'Specialization'}</h4>
                  <p className="text-sm md:text-base text-gray-600 font-medium whitespace-pre-line">{member.specialization[lang]}</p>
                </div>
              )}
            </div>

            {member.type !== 'assistant' && member.type !== 'administration' && (
              <div className="pt-4 md:pt-8">
                <Link to="/contact" className="inline-block w-full md:w-auto bg-[#005a5a] text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-bold uppercase tracking-widest text-center hover:scale-105 transition-transform shadow-lg shadow-[#005a5a]/20">
                  {lang === 'ka' ? 'ჩაეწერეთ ვიზიტზე' : 'Book a visit'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberPage;
