
import React, { useEffect, useState, useContext } from 'react';
import { LanguageContext } from '../App';

const PricePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { lang, siteData } = context;
  const t = siteData[lang];

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  const heroBg = siteData[lang].media?.price_hero || 'https://framerusercontent.com/images/hZGvcwu0k7zo07VbJwEmzsMH7c.jpg';

  return (
    <div className="bg-white min-h-screen pb-32">
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
        <div className="absolute inset-0 opacity-30">
          <img 
            src={heroBg} 
            className="w-full h-full object-cover" 
            alt="" 
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center px-4 transition-all duration-1000 transform">
          <span className="text-[#005a5a] font-bold uppercase tracking-[0.8em] text-[10px] mb-6 block">{t.pricePage.heroSub}</span>
          <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4">{t.pricePage.heroTitle}</h1>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-10 -mt-16 relative z-20">
        <div className="columns-1 lg:columns-2 gap-10 space-y-10">
          {t.pricePage.categories.map((category: any, groupIdx: number) => (
            <div key={groupIdx} className="break-inside-avoid bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-xl border border-gray-50 mb-10 transition-all">
              <div className="flex items-center gap-4 mb-8 md:mb-10">
                <div className="w-8 md:w-10 h-[2px] bg-[#005a5a]" />
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 uppercase tracking-tight">{category.name}</h2>
              </div>
              <div className="space-y-1">
                {category.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-start py-3 md:py-4 border-b border-gray-50 hover:bg-gray-50/50 px-2 md:px-3 rounded-xl transition-all group/item">
                    <span className="text-gray-500 font-semibold text-sm md:text-base group-hover/item:text-[#005a5a] pr-4">{item.n}</span>
                    <span className="text-[#005a5a] font-black text-base md:text-lg whitespace-nowrap">{item.p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PricePage;
