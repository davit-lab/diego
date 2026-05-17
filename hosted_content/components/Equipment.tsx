import React, { useRef, useState, useContext } from 'react';
import { LanguageContext } from '../App';
import { translations } from '../i18n';

const Equipment: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { lang, siteData } = context;
  const t = siteData[lang];

  const equipmentData = [
    { id: '01', image: siteData[lang].media?.equipment_1 || 'https://framerusercontent.com/images/0cDiBk9jk9gtvYgw3hbElEFDBU.png', title: 'Guttafusion Oven', link: 'https://www.vdw-dental.com/en/products/detail/guttafusion-oven/' },
    { id: '02', image: siteData[lang].media?.equipment_2 || 'https://framerusercontent.com/images/HIKyHZZgJSbbVe9r9OatOpn2k.png', title: 'Planmeca ProMax® 3D Plus', link: 'https://www.planmeca.com/dental-imaging/cbct-machines/planmeca-promax-3d-plus' },
    { id: '03', image: siteData[lang].media?.equipment_3 || 'https://framerusercontent.com/images/HUXzvDqjVQdjsDWASUK38Buyfz4.png', title: 'SybronEndo', link: 'https://k-dental.ca/sybronendo-elements-obturation-unit-system-b-handpiece-shield-2-pkg-sp-order-52929-00.html' },
    { id: '04', image: siteData[lang].media?.equipment_4 || 'https://framerusercontent.com/images/JiJtK4JDkx3IP7aYywCGVf3wOE.png', title: 'Planmeca Emerald® S', link: 'https://www.planmeca.com/cadcam-dentistry/intraoral-scanners/planmeca-emerald-s/' }
  ];

  // Drag to scroll logic
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed factor
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({ 
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <section className="relative py-20 md:py-40 px-6 md:px-10 max-w-[1440px] mx-auto overflow-hidden bg-white">
      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.02] select-none pointer-events-none w-full text-center">
        <h2 className="text-[10rem] md:text-[20rem] font-black uppercase tracking-[-0.05em] leading-none text-[#005a5a]">TECH</h2>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#005a5a]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#005a5a]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>
              </span>
              <span className="text-[#005a5a] font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
                {lang === 'ka' ? 'ციფრული სტომატოლოგია' : 'Digital Dentistry'}
              </span>
            </div>
            <h2 className="text-3xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-none">
              {t.equipmentComp.title}
            </h2>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => scroll('left')} 
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-90"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button 
              onClick={() => scroll('right')} 
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-90"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef} 
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-6 md:gap-10 overflow-x-auto hide-scrollbar snap-x snap-mandatory px-2 pb-10 cursor-grab active:cursor-grabbing select-none`}
        >
          {equipmentData.map((item) => (
            <a 
              key={item.id} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="min-w-[280px] md:min-w-[420px] snap-start group relative pointer-events-auto"
              onClick={(e) => { if (isDragging) e.preventDefault(); }}
            >
              <div className="bg-[#fcfdfe] rounded-[3rem] md:rounded-[4rem] aspect-[4/5] p-8 md:p-16 border border-gray-50 shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-4 flex flex-col pointer-events-none">
                {/* ID Tag */}
                <div className="mb-auto">
                  <span className="text-[#005a5a] font-black text-sm uppercase tracking-widest opacity-20 group-hover:opacity-100 transition-opacity">
                    Unit {item.id}
                  </span>
                </div>

                {/* Main Image */}
                <div className="relative h-[60%] flex items-center justify-center">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="max-w-full max-h-full object-contain transition-transform duration-1000 group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                  />
                  {/* Hover Blur Background */}
                  <div className="absolute inset-0 bg-[#005a5a]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                </div>

                {/* Content */}
                <div className="mt-auto pt-10">
                  <h4 className="text-lg md:text-3xl font-black text-gray-900 uppercase tracking-tighter leading-tight mb-4 group-hover:text-[#005a5a] transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#005a5a] transition-all">
                    <span>{lang === 'ka' ? 'დეტალურად' : 'Learn More'}</span>
                    <svg className="w-3 h-3 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Equipment;