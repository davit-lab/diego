import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../App';
import { translations } from '../i18n';

const Services: React.FC = () => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang];

  const serviceHighlights = [
    { id: '01', title: lang === 'ka' ? 'დიაგნოსტიკა' : 'Diagnostics', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: '02', title: lang === 'ka' ? 'ესთეტიკა' : 'Aesthetics', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z' },
    { id: '03', title: lang === 'ka' ? 'იმპლანტოლოგია' : 'Implantology', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.675.27a6 6 0 00-3.857.517l-2.387.477a2 2 0 00-1.022.547V18a2 2 0 002 2h12a2 2 0 002-2v-2.572zM12 11V3.5l1.5 1.5M12 3.5l-1.5 1.5' },
    { id: '04', title: lang === 'ka' ? 'ბავშვთა' : 'Pediatrics', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  return (
    <section className="bg-gray-50 py-20 md:py-40 px-6 md:px-10">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="space-y-4 max-w-2xl">
            <span className="text-[#005a5a] font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">{lang === 'ka' ? 'მომსახურება' : 'Our Services'}</span>
            <h2 className="text-3xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-none">{t.servicesComp.title}</h2>
          </div>
          <Link to="/services" className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs border border-gray-100 shadow-sm hover:bg-[#005a5a] hover:text-white transition-all">
            {lang === 'ka' ? 'ყველა სერვისი' : 'All Services'}
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {serviceHighlights.map((service) => (
            <div key={service.id} className="group bg-white p-4 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-4">
              <div className="w-10 h-10 md:w-16 md:h-16 bg-[#005a5a]/5 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-10 group-hover:bg-[#005a5a] transition-colors">
                <svg className="w-5 h-5 md:w-8 md:h-8 text-[#005a5a] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={service.icon}/>
                </svg>
              </div>
              <span className="text-[#005a5a]/20 font-black text-2xl md:text-4xl block mb-2 md:mb-4 tracking-tighter group-hover:text-[#005a5a]/10">{service.id}</span>
              <h3 className="text-sm md:text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4 break-words leading-tight">{service.title}</h3>
              <p className="text-gray-400 font-medium text-xs md:text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                {lang === 'ka' ? 'უმაღლესი ხარისხის მომსახურება თქვენი კომფორტისთვის.' : 'Highest quality service for your comfort.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;