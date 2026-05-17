
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageContext } from '../App';

const Footer: React.FC = () => {
  const location = useLocation();
  const isContactPage = location.pathname === '/contact';
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { lang, siteData } = context;
  const t = siteData[lang];

  const openingHours = t.footer.days.map((day: string) => ({ 
    day, 
    time: day === t.footer.days[6] ? '11:00 - 18:00' : '10:00 - 20:00' 
  }));

  return (
    <footer className="bg-[#1f1f1f] text-white overflow-hidden">
      {!isContactPage && (
        <div className="bg-white py-12 md:py-24 px-5 md:px-10">
          <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* FB Branding Block */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-8 bg-[#005a5a]/5 p-8 md:p-10 rounded-[3rem] border border-gray-100 h-full">
              <div className="rounded-[2.5rem] overflow-hidden w-full sm:w-[160px] aspect-square bg-white flex items-center justify-center p-6 shadow-xl shrink-0 border border-gray-100">
                 <img src={siteData[lang].media?.logo || "https://framerusercontent.com/images/0RLn6DL4qHZwAL47gzRU28dnWk.png"} alt="Smile Agency" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col justify-center text-center sm:text-left">
                <a href="https://www.facebook.com/SmileAgency.ge" target="_blank" rel="noopener noreferrer" className="flex flex-col sm:flex-row items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-2.5 shadow-lg group-hover:scale-110 transition-transform">
                    <img 
                      src={siteData[lang].media?.fb_icon || "https://framerusercontent.com/images/ghom8ltrRrfS275bArALYmSGF00.png"} 
                      alt="FB" 
                      className="w-full h-full object-contain" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="text-xl md:text-2xl font-black text-[#005a5a] uppercase tracking-tighter group-hover:text-black transition-colors">{t.footer.fb}</h4>
                </a>
              </div>
            </div>

            {/* Map Block */}
            <div className="lg:col-span-7 rounded-[3rem] overflow-hidden h-[350px] md:h-[400px] border border-gray-100 shadow-2xl relative">
              <iframe 
                src="https://maps.google.com/maps?q=41.7166158,44.7747431&z=18&output=embed" 
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000" 
                title="Clinic Map"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Info */}
      <div className="bg-[#005a5a] py-16 px-5 md:px-10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <h6 className="text-lg font-black uppercase tracking-widest mb-8 border-b border-white/10 pb-4">{t.footer.hours}</h6>
            <div className="space-y-2.5">
              {openingHours.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center py-1.5 border-b border-white/5 opacity-80 hover:opacity-100 transition-opacity">
                  <span className="font-bold text-[10px] uppercase">{item.day}</span>
                  <span className="font-black text-[10px]">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h6 className="text-lg font-black uppercase tracking-widest mb-8 border-b border-white/10 pb-4">{t.footer.contact}</h6>
            <div className="space-y-8">
              <a href="tel:555585356" className="flex items-center gap-5 group">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-[#005a5a] transition-all"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg></div>
                <p className="text-lg font-bold">555 58 53 56</p>
              </a>
              <a href="mailto:Smileagency2020@gmail.com" className="flex items-center gap-5 group">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-[#005a5a] transition-all"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></div>
                <p className="text-base font-bold underline underline-offset-4">Smileagency2020@gmail.com</p>
              </a>
              <div className="flex items-center gap-5 group">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>
                <p className="text-sm md:text-base font-bold leading-tight">{t.common.address}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                <p className="opacity-70 text-sm leading-relaxed mb-8 italic font-medium">"{t.footer.desc}"</p>
                <Link to="/services" className="bg-white text-[#005a5a] px-8 py-4 rounded-xl font-black uppercase text-[10px] text-center block tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-xl">{t.footer.btn}</Link>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] py-8 px-5 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center opacity-30 text-[9px] gap-6 uppercase tracking-[0.3em] font-black">
           <p>{t.footer.copy}</p>
           <div className="flex gap-6">
             <Link to="#" className="hover:text-white transition-colors">{t.footer.policy}</Link>
             <span className="opacity-20">|</span>
             <Link to="#" className="hover:text-white transition-colors">{t.footer.terms}</Link>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
