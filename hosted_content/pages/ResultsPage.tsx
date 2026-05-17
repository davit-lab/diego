
import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../App';

const BeforeAfterSlider = ({ before, after, labelBefore, labelAfter }: { before: string, after: string, labelBefore: string, labelAfter: string }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isResizing) return;
    
    const container = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    
    const x = clientX - container.left;
    const position = Math.max(0, Math.min(100, (x / container.width) * 100));
    setSliderPos(position);
  };

  return (
    <div 
      className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl cursor-col-resize select-none"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseDown={() => setIsResizing(true)}
      onMouseUp={() => setIsResizing(false)}
      onMouseLeave={() => setIsResizing(false)}
      onTouchStart={() => setIsResizing(true)}
      onTouchEnd={() => setIsResizing(false)}
    >
      {/* After Image (Background) */}
      <img 
        src={after} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      
      {/* Before Image (Foreground with Clip) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img 
          src={before} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
          <svg className="w-4 h-4 md:w-6 md:h-6 text-[#005a5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7l-5 5m0 0l5 5m-5-5h18m-5-5l5 5m0 0l-5 5" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-30 bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest">
        {labelBefore}
      </div>
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-30 bg-[#005a5a]/80 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest">
        {labelAfter}
      </div>
    </div>
  );
};

const ResultsPage: React.FC = () => {
  const context = useContext(LanguageContext);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  if (!context) return null;
  const { lang, siteData } = context;
  const t = siteData[lang];

  const results = t.resultsPage.items || [];

  const filteredResults = activeCategory === 'all' 
    ? results 
    : results.filter((r: any) => r.category === activeCategory);

  const categories = [
    { id: 'all', label: t.resultsPage.all },
    ...Object.entries(t.resultsPage.categories).map(([id, label]) => ({ id, label: label as string }))
  ];

  return (
    <div className="bg-white min-h-screen pb-20 md:pb-32">
      {/* Hero Section */}
      <section className="pt-12 md:pt-20 pb-8 md:pb-12 px-4 md:px-10 max-w-[1440px] mx-auto text-center">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-3xl md:text-8xl font-black text-gray-900 uppercase tracking-tighter mb-4 md:mb-6">
            {t.resultsPage.title}
          </h1>
          <p className="text-[10px] md:text-xl text-[#005a5a] font-black uppercase tracking-[0.2em] md:tracking-widest max-w-2xl mx-auto leading-relaxed">
            {t.resultsPage.subtitle}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="sticky top-[70px] z-40 bg-white/80 backdrop-blur-md border-y border-gray-100 mb-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="flex items-center gap-2 md:gap-8 overflow-x-auto py-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-[#005a5a] text-white shadow-lg' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-10 space-y-16 md:space-y-32">
        {filteredResults.length > 0 ? (
          filteredResults.map((item, idx) => (
            <div 
              key={item.id} 
              className={`space-y-6 md:space-y-10 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              style={{ transitionDelay: `${idx * 200}ms` }}
            >
              <div className="max-w-5xl mx-auto">
                <BeforeAfterSlider 
                  before={item.before} 
                  after={item.after} 
                  labelBefore={t.resultsPage.before}
                  labelAfter={t.resultsPage.after}
                />
              </div>
              <div className="text-center space-y-2 md:space-y-4">
                <h2 className="text-xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">{item.title}</h2>
                <p className="text-gray-500 font-medium text-xs md:text-lg max-w-xl mx-auto px-4">{item.desc}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest">შედეგები მალე დაემატება...</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ResultsPage;
