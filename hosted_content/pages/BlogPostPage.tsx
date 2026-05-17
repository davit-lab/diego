
import React, { useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useContext(LanguageContext);
  if (!context) return null;
  const { lang, blogPosts } = context;
  const post = blogPosts.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 font-bold uppercase tracking-widest">პოსტი ვერ მოიძებნა / Post Not Found</p>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        <img src={post.image} alt={post.title[lang]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="bg-[#005a5a] text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-5 py-2.5 rounded-full mb-4 md:mb-6 shadow-xl inline-block">
              {post.category[lang]}
            </span>
            <h1 className="text-2xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter max-w-5xl leading-[1.1] break-words px-2">
              {post.title[lang]}
            </h1>
            <p className="text-white/70 mt-4 md:mt-6 font-bold uppercase tracking-widest text-[9px] md:text-sm">
              {post.date} • Smile Agency
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-10 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
        <div className="lg:col-span-8 lg:col-start-3 min-h-[40vh]">
          <div className="mb-8 md:mb-12">
            <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-gray-400 hover:text-[#005a5a] font-bold uppercase text-[9px] md:text-xs tracking-widest transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {lang === 'ka' ? 'უკან დაბრუნება' : 'Go Back'}
            </button>
          </div>

          <div className="prose prose-sm md:prose-lg max-w-none text-gray-700 font-medium leading-[1.8] md:leading-[2] whitespace-pre-line break-words text-lg md:text-xl">
            {post.content[lang] || post.excerpt[lang]}
          </div>

          {/* Consultation Box */}
          <div className="mt-16 md:mt-32 p-8 md:p-14 bg-gray-50 rounded-[2.5rem] md:rounded-[4rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="text-center md:text-left">
              <h4 className="text-2xl md:text-3xl font-black text-gray-900 uppercase mb-3 tracking-tight">
                {lang === 'ka' ? 'გაქვთ კითხვები?' : 'Have questions?'}
              </h4>
              <p className="text-gray-500 font-medium text-sm md:text-lg">
                {lang === 'ka' ? 'ჩვენი გუნდი მზად არის დაგეხმაროთ ნებისმიერ დროს.' : 'Our team is ready to help you anytime.'}
              </p>
            </div>
            <Link to="/contact" className="w-full md:w-auto bg-[#005a5a] text-white px-10 py-5 rounded-2xl text-center font-black uppercase tracking-widest text-[10px] md:text-sm hover:bg-black transition-all shadow-xl active:scale-95 shrink-0">
              {lang === 'ka' ? 'კონსულტაცია' : 'Consultation'}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostPage;
