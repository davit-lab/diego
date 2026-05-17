
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../App';

const BlogPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { lang, siteData, blogPosts } = context;
  const t = siteData[lang];

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  // Use blogPosts from context for reliability
  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* Ghost text only on desktop */}
      <div className="hidden md:block fixed top-1/2 left-0 -translate-y-1/2 opacity-[0.02] select-none pointer-events-none w-full text-center z-0">
        <h2 className="text-[15rem] md:text-[30rem] font-black uppercase tracking-[-0.05em] leading-none text-[#005a5a]">JOURNAL</h2>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 py-12 md:py-32">
        <div className={`mb-12 md:mb-32 space-y-4 md:space-y-6 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center gap-3">
             <span className="h-[2px] w-8 md:w-12 bg-[#005a5a]" />
             <span className="text-[#005a5a] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs">
               {lang === 'ka' ? 'სიახლეები' : 'Our Journal'}
             </span>
          </div>
          <h1 className="text-4xl md:text-8xl lg:text-[10rem] font-black text-gray-900 uppercase tracking-tighter leading-[0.9] mb-4 break-words">
            {t.blogPage.title}
          </h1>
          <p className="text-gray-500 text-base md:text-2xl font-medium max-w-2xl leading-relaxed">
            {t.blogPage.subtitle}
          </p>
        </div>

        {featuredPost ? (
          <>
            <div className={`mb-16 md:mb-40 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <Link to={`/blog/${featuredPost.id}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
                <div className="lg:col-span-8 overflow-hidden rounded-[2rem] md:rounded-[4rem] shadow-xl aspect-video lg:aspect-[16/9]">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title[lang]} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="lg:col-span-4 space-y-4 md:space-y-8">
                  <div className="space-y-2 md:space-y-4">
                    <span className="bg-[#005a5a] text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full inline-block">
                      {featuredPost.category[lang]}
                    </span>
                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">{featuredPost.date}</p>
                  </div>
                  <h2 className="text-2xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-tight group-hover:text-[#005a5a] transition-colors">
                    {featuredPost.title[lang]}
                  </h2>
                  <p className="text-gray-500 font-medium text-sm md:text-lg leading-relaxed line-clamp-3">
                    {featuredPost.excerpt[lang]}
                  </p>
                  <div className="pt-2 flex items-center gap-3 text-gray-900 font-black uppercase text-[10px] tracking-[0.2em] group-hover:gap-5 transition-all">
                    {t.blogPage.readMore}
                    <svg className="w-4 h-4 text-[#005a5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
              {regularPosts.map((post: any, index: number) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.id}`} 
                  className={`group transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                  style={{ transitionDelay: `${(index + 1) * 200 + 400}ms` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] md:rounded-[3.5rem] mb-6 md:mb-10 shadow-md group-hover:shadow-2xl transition-all duration-500">
                    <img 
                      src={post.image} 
                      alt={post.title[lang]} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-4 px-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[#005a5a] font-black uppercase text-[8px] md:text-[10px] tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                        {post.category[lang]}
                      </span>
                      <span className="text-gray-400 font-bold text-[8px] md:text-[10px] uppercase tracking-widest">{post.date}</span>
                    </div>
                    <h3 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter leading-tight group-hover:text-[#005a5a] transition-colors">
                      {post.title[lang]}
                    </h3>
                    <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed line-clamp-2">
                      {post.excerpt[lang]}
                    </p>
                    <div className="pt-1 flex items-center gap-3 text-gray-400 group-hover:text-[#005a5a] font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all">
                      {t.blogPage.readMore}
                      <svg className="w-3 h-3 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest">{lang === 'ka' ? 'ბლოგები ჯერ არ არის' : 'No blog posts yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
