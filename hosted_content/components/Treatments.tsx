import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../App';
import { translations } from '../i18n';

const TreatmentCard = ({ image, title, category, link }: { image: string, title: string, category: string, link: string }) => (
  <Link to={link} className="relative group block overflow-hidden rounded-[2.5rem] md:rounded-[4rem] aspect-[3/4] md:aspect-auto md:h-[600px] shadow-xl">
    <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 right-8 space-y-2 md:space-y-4">
      <span className="text-[#005a5a] font-black uppercase tracking-[0.3em] text-[10px] md:text-xs bg-white/10 backdrop-blur-md px-4 py-2 rounded-full inline-block">
        {category}
      </span>
      <h3 className="text-white text-2xl md:text-5xl font-black uppercase tracking-tighter leading-none group-hover:translate-x-4 transition-transform duration-500">
        {title}
      </h3>
    </div>
  </Link>
);

const Treatments: React.FC = () => {
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { lang, siteData } = context;
  const t = siteData[lang];

  return (
    <section className="py-20 md:py-40 px-6 md:px-10 max-w-[1440px] mx-auto bg-white">
      <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8">
          <TreatmentCard 
            image={siteData[lang].media?.treatment_1 || "https://framerusercontent.com/images/PCHp4YGU02Gr9bhVeNxl3NlwDeE.jpg"} 
            title={lang === 'ka' ? 'იმპლანტოლოგია' : 'Implantology'} 
            category="01"
            link="/services" 
          />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-8 md:gap-12">
          <div className="bg-[#f8fafb] p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] flex-1 flex flex-col justify-center space-y-6 border border-gray-100">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-tight">
              {lang === 'ka' ? 'თქვენი ღიმილი ჩვენი მისიაა' : 'Your Smile is Our Mission'}
            </h2>
            <p className="text-gray-500 font-medium text-sm md:text-lg leading-relaxed">
              {t.treatmentsComp.desc}
            </p>
            <Link to="/contact" className="bg-[#005a5a] text-white w-full py-5 rounded-2xl text-center font-black uppercase tracking-widest text-[10px] md:text-xs shadow-lg hover:bg-gray-900 transition-all">
              {t.common.bookVisit}
            </Link>
          </div>
          <TreatmentCard 
            image={siteData[lang].media?.treatment_2 || "https://framerusercontent.com/images/InTtVcj8vGawB5IxVzmu2I4ic.png"} 
            title={lang === 'ka' ? 'ორთოდონტია' : 'Orthodontics'} 
            category="02"
            link="/services" 
          />
        </div>
      </div>
    </section>
  );
};

export default Treatments;