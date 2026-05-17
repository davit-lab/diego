
import React, { createContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Treatments from './components/Treatments';
import Equipment from './components/Equipment';
import Footer from './components/Footer';

import AboutPage from './pages/AboutPage';
import TeamPage, { teamData as initialTeam } from './pages/TeamPage';
import TeamMemberPage from './pages/TeamMemberPage';
import ServicesPage from './pages/ServicesPage';
import PricePage from './pages/PricePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import ResultsPage from './pages/ResultsPage';
import AdminPage from './pages/AdminPage';
import { translations as initialTranslations } from './i18n';
import { API } from './api';

type Language = 'ka' | 'en';

interface ContentContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  siteData: any;
  setSiteData: (data: any) => void;
  team: any[];
  setTeam: (team: any[]) => void;
  blogPosts: any[];
  setBlogPosts: (posts: any[]) => void;
  leads: any[];
  setLeads: (leads: any[]) => void;
  saveChanges: () => Promise<void>;
}

export const LanguageContext = createContext<ContentContextType | null>(null);

const HomePage: React.FC = () => (
  <main className="min-h-screen">
    <Hero />
    <About />
    <Services />
    <Treatments />
    <Equipment />
  </main>
);

const App: React.FC = () => {
  const [lang, setLangState] = useState<Language>(() => (localStorage.getItem('site-lang') as Language) || 'ka');
  const [siteData, setSiteData] = useState(initialTranslations);
  const [team, setTeam] = useState(initialTeam);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const [content, teamList, leadsList, dbPosts] = await Promise.all([
        API.getContent(initialTranslations),
        API.getTeam(initialTeam),
        API.getLeads(),
        API.getBlogPosts()
      ]);
      
      setSiteData(content);
      setTeam(teamList);
      setLeads(leadsList);
      
      // Fallback: If DB is empty, use posts from i18n
      const fallbackPosts = Object.entries(initialTranslations.ka.blogPage.posts).map(([id, p]: [string, any]) => ({
        id,
        title: { ka: p.title, en: initialTranslations.en.blogPage.posts[id].title },
        content: { ka: p.content, en: initialTranslations.en.blogPage.posts[id].content },
        category: { ka: p.category, en: initialTranslations.en.blogPage.posts[id].category },
        excerpt: { ka: p.excerpt, en: initialTranslations.en.blogPage.posts[id].excerpt },
        image: p.image,
        date: p.date
      }));

      setBlogPosts(dbPosts.length > 0 ? dbPosts : fallbackPosts);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const logoUrl = siteData?.ka?.media?.logo || siteData?.en?.media?.logo;
    if (logoUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = logoUrl;
    }
  }, [siteData]);

  const saveChanges = async () => {
    await Promise.all([
      API.updateContent(siteData),
      API.updateTeam(team),
      API.updateBlogPosts(blogPosts)
    ]);
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('site-lang', newLang);
  };

  if (loading) return null;

  return (
    <LanguageContext.Provider value={{ lang, setLang, siteData, setSiteData, team, setTeam, blogPosts, setBlogPosts, leads, setLeads, saveChanges }}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about-us" element={<AboutPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/team/:id" element={<TeamMemberPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/price" element={<PricePage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<BlogPostPage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                </Routes>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </LanguageContext.Provider>
  );
};

export default App;
