
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../App';
import Treatments from '../components/Treatments';

const ServicesPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { lang, siteData } = context;
  const t = siteData[lang];

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  const serviceKeys = [
    'orthopedics', 
    'pediatrics', 
    'surgery', 
    'endodontics', 
    'aesthetics', 
    'implantology', 
    'orthodontics', 
    'periodontology'
  ];

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <section className="pt-20 pb-10 px-4 md:px-10 max-w-[1440px] mx-auto text-center">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-3xl md:text-8xl font-bold text-gray-900 uppercase tracking-tighter mb-6">{t.servicesPage.heroTitle}</h1>
          <p className="text-sm md:text-xl text-[#005a5a] font-bold uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">{t.servicesPage.heroSub}</p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-20 md:pb-32">
        <div className="space-y-16 md:space-y-24">
          {serviceKeys.map((key, index) => {
            const service = (t.servicesPage.items as any)[key];
            if (!service) return null;

            const defaultImg = {
              orthopedics: siteData[lang].media?.service_orthopedics || 'https://framerusercontent.com/images/PCHp4YGU02Gr9bhVeNxl3NlwDeE.jpg',
              pediatrics: siteData[lang].media?.service_pediatrics || 'https://framerusercontent.com/images/0JhnuSVKqzhBvoFbmldufpEA.jpg',
              surgery: siteData[lang].media?.service_surgery || 'https://framerusercontent.com/images/QQ50fOqBmC27PyxomM9BpnW9Yho.jpg',
              endodontics: siteData[lang].media?.service_endodontics || 'https://framerusercontent.com/images/Es82GeniQfvbrLe8GIg5ctOEq6M.jpg',
              aesthetics: siteData[lang].media?.service_aesthetics || 'https://framerusercontent.com/images/NL9ZihxOkco4TeWtDDi8fz20.jpg',
              implantology: siteData[lang].media?.service_implantology || 'https://framerusercontent.com/images/PCHp4YGU02Gr9bhVeNxl3NlwDeE.jpg',
              orthodontics: siteData[lang].media?.service_orthodontics || 'https://framerusercontent.com/images/InTtVcj8vGawB5IxVzmu2I4ic.png',
              periodontology: siteData[lang].media?.service_periodontology || 'https://framerusercontent.com/images/0JhnuSVKqzhBvoFbmldufpEA.jpg'
            }[key as keyof typeof defaultImg];

            return (
              <div key={key} className={`grid lg:grid-cols-12 gap-8 md:gap-12 border-b border-gray-100 pb-16 md:pb-24 last:border-0 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                <div className="lg:col-span-5">
                  <div className="sticky top-32 space-y-6 md:space-y-8">
                    <div className="flex items-center gap-3 md:gap-4">
                      <span className="text-4xl md:text-6xl font-black text-[#005a5a]/10">0{index + 1}</span>
                      <h2 className="text-2xl md:text-4xl font-bold text-gray-900 uppercase tracking-tight">{service.title}</h2>
                    </div>
                    <div className="rounded-[2rem] md:rounded-[3.5rem] overflow-hidden aspect-[4/3] shadow-xl group">
                      <img 
                        src={service.image || defaultImg} 
                        alt={service.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7 pt-6 md:pt-12">
                  <div className="max-w-2xl space-y-8 md:space-y-10">
                    <p className="text-base md:text-xl text-gray-600 font-medium leading-[1.7]">{service.desc}</p>
                    <div className="grid gap-4 md:gap-6">
                      {service.subs?.map((sub: any, sIdx: number) => (
                        <div key={sIdx} className="bg-gray-50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 hover:shadow-md transition-shadow">
                          <h4 className="text-[#005a5a] font-bold uppercase tracking-widest text-[10px] md:text-xs mb-2 md:mb-3">{sub.title}</h4>
                          <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">{sub.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 md:pt-6">
                      <Link to="/contact" className="inline-block w-full md:w-auto text-center bg-[#005a5a] text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-900 transition-all shadow-lg active:scale-95">{t.common.consultation}</Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-gray-50"><Treatments /></div>
    </div>
  );
};

export default ServicesPage;
