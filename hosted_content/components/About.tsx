
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../App';

const About: React.FC = () => {
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { lang, siteData } = context;
  const t = siteData[lang];

  const aboutImg = siteData[lang].media?.about_home || "https://framerusercontent.com/images/0JhnuSVKqzhBvoFbmldufpEA.jpg";

  return (
    <section className="relative py-20 md:py-40 px-6 md:px-10 max-w-[1440px] mx-auto overflow-hidden bg-white">
      <div className="grid lg:grid-cols-12 gap-12 md:gap-20 items-center">
        <div className="lg:col-span-6 relative">
          <div className="relative z-10 w-[85%] aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src={aboutImg} 
              alt="" 
              loading="lazy" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute top-1/2 -left-10 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
            <h2 className="text-[12rem] md:text-[20rem] font-black uppercase tracking-tighter text-[#005a5a]">SMILE</h2>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-8 md:space-y-12">
          <div className="space-y-4">
            <span className="text-[#005a5a] font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">{lang === 'ka' ? 'ვინ ვართ ჩვენ' : 'Who We Are'}</span>
            <h2 className="text-3xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-none">{t.aboutComp.title}</h2>
          </div>
          
          <div className="space-y-6">
            <p className="text-base md:text-2xl text-gray-800 font-bold leading-snug border-l-4 border-[#005a5a] pl-6 md:pl-10">{t.aboutComp.desc}</p>
          </div>

          <div className="pt-4 pl-10">
            <Link to="/about-us" className="inline-flex items-center gap-4 group">
              <span className="bg-[#005a5a] text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center group-hover:bg-gray-900 transition-all shadow-lg">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </span>
              <span className="text-xs md:text-sm font-black uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-1">{lang === 'ka' ? 'გაიგეთ მეტი' : 'Learn more'}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
