
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../App';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { lang, siteData } = context;
  const t = siteData[lang];

  const slides = [
    { image: siteData[lang].media?.hero_slide_1 || 'https://framerusercontent.com/images/hZGvcwu0k7zo07VbJwEmzsMH7c.jpg', id: 1 },
    { image: siteData[lang].media?.hero_slide_2 || 'https://framerusercontent.com/images/uJM98S9Hf8UAVNmz4LCDbbRr1JU.jpg', id: 2 }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden bg-white">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
            <img src={slide.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          </div>
        ))}
      </div>
      <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col justify-center">
        <div className="max-w-4xl space-y-6 md:space-y-10">
          <div className="inline-flex items-center gap-3">
            <span className="h-[2px] w-12 bg-[#005a5a]" />
            <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">Professional Dental Care</span>
          </div>
          <h1 className="text-white text-3xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">
            {t.hero.welcome} <br />
            <span className="text-white/40">{t.hero.agency}</span>
          </h1>
          <div className="flex gap-6 pt-4">
            <Link to="/contact" className="bg-[#005a5a] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#005a5a] transition-all shadow-2xl">
              {t.nav.book}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
