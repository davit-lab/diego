
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageContext } from '../App';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { lang, setLang, siteData } = context;
  const t = siteData[lang];
  
  const navItems = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.about, path: '/about-us' },
    { label: t.nav.team, path: '/team' },
    { label: t.nav.services, path: '/services' },
    { label: t.nav.results, path: '/results' },
    { label: t.nav.price, path: '/price' },
    { label: t.nav.blog, path: '/blog' },
    { label: t.nav.contact, path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on location change
  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  }, [location.pathname]);

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    document.body.style.overflow = newState ? 'hidden' : 'auto';
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled || isMenuOpen ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-16 md:h-[70px] flex items-center justify-between">
          <Link to="/" className="relative z-[1100] transition-transform active:scale-95 flex items-center">
            <img 
              src={siteData[lang].media?.logo || "https://framerusercontent.com/images/0RLn6DL4qHZwAL47gzRU28dnWk.png"} 
              alt="Logo" 
              className="h-7 md:h-10 w-auto object-contain" 
              referrerPolicy="no-referrer"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} className={`text-[12px] font-black uppercase tracking-[0.1em] transition-all relative group ${isActive ? 'text-[#005a5a]' : 'text-gray-400 hover:text-gray-900'}`}>
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#005a5a] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>
                );
              })}
            </div>
            
            <div className="flex items-center gap-3 border-l border-gray-100 pl-6 h-6">
              <button onClick={() => setLang('ka')} className={`text-[10px] font-black transition-colors ${lang === 'ka' ? 'text-[#005a5a]' : 'text-gray-300 hover:text-gray-600'}`}>GE</button>
              <span className="text-gray-200 text-[10px]">|</span>
              <button onClick={() => setLang('en')} className={`text-[10px] font-black transition-colors ${lang === 'en' ? 'text-[#005a5a]' : 'text-gray-300 hover:text-gray-600'}`}>EN</button>
            </div>
            
            <Link to="/contact" className="bg-[#005a5a] text-white px-7 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-gray-900 transition-all shadow-sm">{t.nav.book}</Link>
          </nav>

          <div className="flex items-center gap-4 lg:hidden relative z-[1100]">
             <button onClick={() => setLang(lang === 'ka' ? 'en' : 'ka')} className="text-[10px] font-black text-[#005a5a] bg-gray-100 px-3 py-1 rounded-full uppercase">{lang === 'ka' ? 'EN' : 'GE'}</button>
              <button onClick={toggleMenu} className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none" aria-label="Toggle Menu">
                <span className={`w-6 h-0.5 bg-[#005a5a] transition-all duration-300 transform origin-center ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-6 h-0.5 bg-[#005a5a] transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`w-6 h-0.5 bg-[#005a5a] transition-all duration-300 transform origin-center ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-white z-[1050] lg:hidden transition-all duration-500 ease-in-out transform ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <div className="flex flex-col h-full pt-28 px-10 pb-10">
            <nav className="flex-1 space-y-4">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className={`block text-4xl font-black uppercase tracking-tighter transition-colors ${location.pathname === item.path ? 'text-[#005a5a]' : 'text-gray-900'}`}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="pt-10 border-t border-gray-100 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div><p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Call Us</p><p className="font-bold text-gray-900">555 58 53 56</p></div>
                <div><p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Visit</p><p className="font-bold text-gray-900">Balanchivadze 14</p></div>
              </div>
              <Link to="/contact" className="block w-full bg-[#005a5a] text-white py-6 rounded-2xl text-center font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-transform">
                {t.nav.book}
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="h-16 md:h-[70px] w-full" />
    </>
  );
};

export default Header;
