
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../App';
import { translations } from '../i18n';

const AboutPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { lang, siteData } = context;
  const t = siteData[lang];

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* Immersive Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={siteData[lang].media?.about_hero || "https://framerusercontent.com/images/uJM98S9Hf8UAVNmz4LCDbbRr1JU.jpg"} 
            className={`w-full h-full object-cover transition-transform duration-[12000ms] ease-out ${isVisible ? 'scale-100' : 'scale-125'}`} 
            alt="Hero" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-white" />
        </div>
        
        <div className={`relative z-10 text-center px-6 transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="inline-flex items-center gap-4 mb-8">
            <span className={`h-[1px] bg-[#005a5a] transition-all duration-1000 delay-700 ${isVisible ? 'w-24' : 'w-0'}`} />
            <span className="text-[#005a5a] font-black uppercase tracking-[0.5em] text-[10px] md:text-xs">{t.aboutPage.heroSub}</span>
            <span className={`h-[1px] bg-[#005a5a] transition-all duration-1000 delay-700 ${isVisible ? 'w-24' : 'w-0'}`} />
          </div>
          <h1 className="text-4xl md:text-[13rem] font-black text-white uppercase tracking-tighter leading-[0.85] mb-8 drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)]">
            {t.aboutPage.heroTitle}
          </h1>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="relative py-32 md:py-56 px-6 md:px-10 max-w-[1440px] mx-auto overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none w-full text-center">
          <h2 className={`text-[8rem] md:text-[35rem] font-black uppercase tracking-[-0.05em] leading-none text-[#005a5a] transition-transform duration-[3000ms] ${isVisible ? 'translate-y-0' : 'translate-y-20'}`}>EST 2020</h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 md:gap-32 items-center relative z-10">
          <div className={`lg:col-span-6 space-y-8 md:space-y-12 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#005a5a]" />
                <span className="text-[#005a5a] font-black uppercase tracking-[0.3em] text-[10px] md:text-xs block">{t.aboutPage.historyTitle}</span>
              </div>
              <h2 className="text-3xl md:text-[7rem] font-black text-gray-900 uppercase tracking-tighter leading-[0.9]">{t.aboutPage.historyMain}</h2>
            </div>
            
            <div className="space-y-6 md:space-y-10">
              <p className="text-lg md:text-4xl text-gray-800 font-bold leading-tight border-l-4 md:border-l-8 border-[#005a5a] pl-6 md:pl-8 italic">
                {t.aboutPage.historyQuote}
              </p>
              <div className="text-gray-500 font-medium text-base md:text-lg leading-relaxed max-w-xl pl-6 md:pl-12">
                <p className="whitespace-pre-line">{t.aboutPage.historyDesc}</p>
              </div>
            </div>
          </div>

          <div className={`lg:col-span-6 relative transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-20 opacity-0 scale-90'}`}>
            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl aspect-[4/5] border-[16px] border-white group">
              <img 
                src={siteData[lang].media?.about_history || "https://framerusercontent.com/images/ZFhqqQkoQE5tjqtakzIHWZQNhOw.png"} 
                alt="Our Story" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - STUDIO REDESIGN */}
      <section className="bg-[#111] py-32 md:py-64 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#005a5a] blur-[180px] rounded-full animate-pulse" />
           <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#005a5a] blur-[180px] rounded-full animate-pulse" />
        </div>
        
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {t.aboutPage.stats.map((stat, i) => (
              <div 
                key={i} 
                className={`group relative p-8 md:p-14 rounded-[2.5rem] md:rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-[#005a5a] hover:border-transparent transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'} flex flex-col justify-end min-h-[280px] md:min-h-[400px] overflow-hidden`} 
                style={{ transitionDelay: `${i * 150 + 400}ms` }}
              >
                {/* Large Background Ghost Value */}
                <span className="absolute -top-10 -right-10 text-[8rem] md:text-[10rem] font-black text-white/[0.02] select-none pointer-events-none group-hover:text-white/10 transition-colors duration-700">
                  {stat.value.split('+')[0]}
                </span>

                <div className="relative space-y-4 md:space-y-6">
                  <div className="overflow-hidden">
                    <span className="text-4xl lg:text-[6rem] font-black text-[#005a5a] group-hover:text-white block tracking-tighter leading-none transition-transform duration-500 group-hover:-translate-y-2 break-all">
                      {stat.value}
                    </span>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <h4 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-500">{stat.label}</h4>
                    <p className="text-white/40 group-hover:text-white/70 uppercase text-[9px] md:text-xs font-bold tracking-[0.3em] transition-colors">{stat.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Excellence */}
      <section className="py-24 md:py-48 px-6 md:px-10 max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
            <div className="relative group rounded-3xl p-8">
              <img 
                src={siteData[lang].media?.equipment_2 || "https://framerusercontent.com/images/HIKyHZZgJSbbVe9r9OatOpn2k.png"} 
                alt="Clinical Excellence" 
                className="relative z-10 w-full max-h-[600px] object-contain drop-shadow-2xl transition-transform duration-1000 group-hover:scale-105" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          <div className={`space-y-8 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <div className="space-y-4">
              <span className="text-[#005a5a] font-black uppercase tracking-[0.4em] text-[10px] md:text-xs block">Tech Leader</span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-[0.95]">
                {t.aboutPage.techTitle}
              </h2>
            </div>
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-medium">
              {t.aboutPage.techDesc}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4 md:px-10">
        <div className={`max-w-[1440px] mx-auto bg-gray-900 rounded-[3rem] md:rounded-[5rem] p-12 md:p-40 text-center text-white relative overflow-hidden transition-all duration-1000 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="absolute inset-0 bg-[#005a5a]/40 z-0" />
          <div className="relative z-10 max-w-5xl mx-auto space-y-12 md:space-y-16">
            <h2 className="text-4xl md:text-[10rem] font-black uppercase tracking-tighter leading-none mb-8 md:mb-12 drop-shadow-2xl">
              {t.aboutPage.ctaTitle}
            </h2>
            <Link to="/contact" className="inline-block w-full md:w-auto bg-white text-gray-900 px-10 md:px-32 py-6 md:py-8 rounded-full font-black uppercase tracking-[0.3em] hover:bg-[#005a5a] hover:text-white transition-all duration-500 text-xs md:text-sm active:scale-95">
              {t.aboutPage.ctaBtn}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
