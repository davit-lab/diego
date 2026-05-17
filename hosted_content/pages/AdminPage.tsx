
import React, { useState, useContext, useCallback } from 'react';
import { LanguageContext } from '../App';
import { API } from '../api';

const AdminPage: React.FC = () => {
  const context = useContext(LanguageContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ user: '', pass: '' });
  const [activeTab, setActiveTab] = useState<'about' | 'team' | 'pricing' | 'blog' | 'leads' | 'footer' | 'photos' | 'results' | 'sections' | 'storage'>('blog');
  const [isSaving, setIsSaving] = useState(false);
  const [saveNote, setSaveNote] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [storageStats, setStorageStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    const stats = await API.getStorageStats();
    setStorageStats(stats);
    setIsLoadingStats(false);
  }, []);

  React.useEffect(() => {
    if (activeTab === 'storage') {
      fetchStats();
    }
  }, [activeTab, fetchStats]);

  if (!context) return null;
  const { siteData, setSiteData, team, setTeam, blogPosts, setBlogPosts, leads, setLeads } = context;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.user === 'smile' && loginData.pass === 'smile2026') setIsLoggedIn(true);
    else alert('წვდომა უარყოფილია!');
  };

  const notify = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSaveNote({ text, type });
    setTimeout(() => setSaveNote(null), 4000);
  };

  const publishData = async () => {
    setIsSaving(true);
    try {
      const [contentRes, teamRes, blogRes] = await Promise.all([
        API.updateContent(siteData),
        API.updateTeam(team),
        API.updateBlogPosts(blogPosts)
      ]);
      
      let errors = [];
      if (!contentRes.ok) errors.push('საიტის კონტენტი');
      if (!teamRes.ok) errors.push('გუნდის წევრები');
      if (!blogRes.ok) errors.push('ბლოგის პოსტები');

      if (errors.length === 0) {
        notify('მონაცემები წარმატებით დასინქრონირდა!');
      } else {
        notify(`შეცდომა ატვირთვისას: ${errors.join(', ')}. შეამოწმეთ Supabase-ის კონფიგურაცია.`, 'error');
      }
    } catch (e) { 
      notify('კავშირის შეცდომა. შეამოწმეთ ინტერნეტი ან ბრაუზერის კონსოლი.', 'error'); 
    }
    finally { setIsSaving(false); }
  };

  const updateNested = useCallback((path: string, value: any) => {
    setSiteData((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  }, [setSiteData]);

  const InputPair = ({ label, path, isTextArea = false, isImage = false }: { label: string, path: string, isTextArea?: boolean, isImage?: boolean }) => {
    const showPreview = isImage || 
                      label.toLowerCase().includes('image') || 
                      label.toLowerCase().includes('icon') || 
                      label.toLowerCase().includes('slide') || 
                      label.toLowerCase().includes('logo') ||
                      path.includes('media.');
    
    const getVal = (lang: string) => {
      const keys = path.split('.');
      let cur = siteData[lang];
      for (const k of keys) { if (!cur || !cur[k]) return ""; cur = cur[k]; }
      return cur;
    };

    if (showPreview) {
      const val = getVal('ka') || getVal('en');
      return (
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-4">
          <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] ml-2">{label}</h4>
          <div className="flex gap-4 items-center">
            {val && (
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                <img src={val} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <input 
                value={val} 
                onChange={e => {
                  updateNested(`ka.${path}`, e.target.value);
                  updateNested(`en.${path}`, e.target.value);
                }} 
                className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border border-transparent focus:border-teal-100 text-xs" 
                placeholder="ფოტოს ლინკი (URL)"
              />
              <div className="flex items-center gap-4">
                {val && <button onClick={() => { updateNested(`ka.${path}`, ''); updateNested(`en.${path}`, ''); }} className="text-red-400 text-[9px] font-black uppercase tracking-widest">წაშლა</button>}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-4">
        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] ml-2">{label}</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-teal-600 uppercase tracking-widest ml-1">KA</label>
            {isTextArea ? (
              <textarea value={getVal('ka')} onChange={e => updateNested(`ka.${path}`, e.target.value)} rows={4} className="w-full p-4 bg-gray-50 rounded-xl font-medium outline-none border border-transparent focus:border-teal-100" />
            ) : (
              <input value={getVal('ka')} onChange={e => updateNested(`ka.${path}`, e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border border-transparent focus:border-teal-100" />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-orange-600 uppercase tracking-widest ml-1">EN</label>
            {isTextArea ? (
              <textarea value={getVal('en')} onChange={e => updateNested(`en.${path}`, e.target.value)} rows={4} className="w-full p-4 bg-gray-50 rounded-xl font-medium outline-none border border-transparent focus:border-orange-100" />
            ) : (
              <input value={getVal('en')} onChange={e => updateNested(`en.${path}`, e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border border-transparent focus:border-orange-100" />
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl w-full max-w-lg text-center">
        <img src={siteData.ka.media?.logo || "https://framerusercontent.com/images/0RLn6DL4qHZwAL47gzRU28dnWk.png"} className="h-12 mx-auto mb-12" alt="Logo" referrerPolicy="no-referrer" />
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 text-gray-900">Admin Control Panel</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input type="text" className="w-full p-5 bg-gray-50 rounded-2xl font-bold outline-none" placeholder="Username" onChange={e => setLoginData({...loginData, user: e.target.value})} />
          <input type="password" className="w-full p-5 bg-gray-50 rounded-2xl font-bold outline-none" placeholder="Password" onChange={e => setLoginData({...loginData, pass: e.target.value})} />
          <button className="w-full py-6 bg-[#005a5a] text-white font-black rounded-2xl uppercase tracking-[0.2em] hover:bg-black transition-all">ავტორიზაცია</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <div className="w-80 bg-[#0c0c0c] flex flex-col fixed h-full z-[100] shadow-2xl">
        <div className="p-10 border-b border-white/5">
          <img src={siteData.ka.media?.logo || "https://framerusercontent.com/images/0RLn6DL4qHZwAL47gzRU28dnWk.png"} className="h-8 brightness-0 invert" alt="Logo" referrerPolicy="no-referrer" />
        </div>
        <nav className="flex-1 p-6 space-y-1 overflow-y-auto hide-scrollbar">
          {['sections', 'results', 'about', 'team', 'pricing', 'blog', 'leads', 'footer', 'photos', 'storage'].map(id => (
            <button key={id} onClick={() => setActiveTab(id as any)} className={`w-full flex items-center gap-5 p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === id ? 'bg-[#005a5a] text-white' : 'text-white/30 hover:text-white'}`}>
              {id.toUpperCase()}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5">
          <button onClick={publishData} disabled={isSaving} className="w-full py-5 bg-orange-500 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-2xl hover:bg-orange-600 transition-all">
             {isSaving ? 'იტვირთება...' : '🚀 PUSH TO CLOUD'}
          </button>
        </div>
      </div>

      <div className="flex-1 ml-80 p-12 lg:p-24 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-12">
          {saveNote && (
            <div className={`fixed top-10 right-10 p-6 rounded-2xl text-white font-black uppercase text-xs tracking-widest z-[2000] shadow-2xl animate-bounce ${saveNote.type === 'success' ? 'bg-[#005a5a]' : 'bg-red-500'}`}>
              {saveNote.text}
            </div>
          )}

          <div className="flex justify-between items-end">
            <h1 className="text-6xl font-black text-gray-900 uppercase tracking-tighter">{activeTab}</h1>
          </div>

          {activeTab === 'storage' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Leads (ლიდები)</h4>
                  <div className="text-4xl font-black text-teal-600">{isLoadingStats ? '...' : storageStats?.leads || 0}</div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ჩანაწერების რაოდენობა</p>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Team (გუნდი)</h4>
                  <div className="text-4xl font-black text-orange-50">{isLoadingStats ? '...' : storageStats?.team || 0}</div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ჩანაწერების რაოდენობა</p>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Blog (ბლოგი)</h4>
                  <div className="text-4xl font-black text-purple-600">{isLoadingStats ? '...' : storageStats?.blog || 0}</div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ჩანაწერების რაოდენობა</p>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Content (კონტენტი)</h4>
                  <div className="text-4xl font-black text-blue-600">{isLoadingStats ? '...' : storageStats?.content || 0}</div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ჩანაწერების რაოდენობა</p>
                </div>
              </div>

              <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm space-y-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Database Health & Limits</h3>
                  <button onClick={fetchStats} className="px-6 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-50 hover:text-teal-600 transition-all">განახლება</button>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-gray-400">Database Usage (Estimated)</span>
                      <span className="text-teal-600">Free Tier (500MB Limit)</span>
                    </div>
                    <div className="h-4 bg-gray-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500 transition-all duration-1000" 
                        style={{ width: `${Math.min((storageStats?.totalRows || 0) / 100, 100)}%` }} 
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold leading-relaxed bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200">
                      <span className="text-teal-600 block mb-2">ოფიციალური შეტყობინება სისტემის მდგომარეობაზე:</span>
                      თქვენი მონაცემთა ბაზა სარგებლობს Supabase-ის უფასო პაკეტით (Free Tier), რომელიც გამოყოფს 500MB მეხსიერებას. 
                      ვინაიდან ფოტოებს ინახავთ გარე ლინკების სახით, ბაზაში მხოლოდ ტექსტური ინფორმაცია გროვდება, რაც ძალიან მცირე ადგილს იკავებს. 
                      არსებული რესურსი სრულად აკმაყოფილებს საიტის საჭიროებებს და ბაზის გადავსების საფრთხე პრაქტიკულად არ არსებობს.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Records</h5>
                      <p className="text-2xl font-black">{storageStats?.totalRows || 0}</p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</h5>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-sm font-black text-green-600 uppercase tracking-widest">Optimal Performance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-400 ml-2">Hero Section</h3>
                <InputPair label="Hero Welcome Text" path="hero.welcome" />
                <InputPair label="Hero Agency Name" path="hero.agency" />
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-400 ml-2">Services Section</h3>
                <InputPair label="Services Title" path="servicesComp.title" />
                <InputPair label="Services Description" path="servicesComp.desc" isTextArea={true} />
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-400 ml-2">Treatments Section</h3>
                <InputPair label="Treatments Title" path="treatmentsComp.title" />
                <InputPair label="Treatments Description" path="treatmentsComp.desc" isTextArea={true} />
                <InputPair label="Treatments Button Text" path="treatmentsComp.btn" />
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-400 ml-2">Equipment Section</h3>
                <InputPair label="Equipment Title" path="equipmentComp.title" />
                <InputPair label="Equipment Unit Label" path="equipmentComp.unit" />
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-10">
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-400 ml-2">Page Header</h3>
                <InputPair label="Results Page Title" path="resultsPage.title" />
                <InputPair label="Results Page Subtitle" path="resultsPage.subtitle" />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase tracking-tight text-gray-400 ml-2">Categories</h3>
                  <button 
                    onClick={() => {
                      const id = prompt('შეიყვანეთ კატეგორიის ID (მაგ: implants):');
                      if (!id) return;
                      const nData = JSON.parse(JSON.stringify(siteData));
                      if (nData.ka.resultsPage.categories[id]) return alert('ეს ID უკვე არსებობს');
                      nData.ka.resultsPage.categories[id] = 'ახალი კატეგორია';
                      nData.en.resultsPage.categories[id] = 'New Category';
                      setSiteData(nData);
                    }}
                    className="px-4 py-2 bg-teal-50 text-teal-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all"
                  >
                    + კატეგორია
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(siteData.ka.resultsPage.categories || {}).map(([id, label]: [string, any]) => (
                    <div key={id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 relative group">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">ID: {id}</span>
                        <button 
                          onClick={() => {
                            if (confirm('ნამდვილად გსურთ კატეგორიის წაშლა?')) {
                              const nData = JSON.parse(JSON.stringify(siteData));
                              delete nData.ka.resultsPage.categories[id];
                              delete nData.en.resultsPage.categories[id];
                              setSiteData(nData);
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-teal-600 uppercase tracking-widest ml-1">KA</label>
                          <input 
                            value={label} 
                            onChange={e => {
                              const nData = JSON.parse(JSON.stringify(siteData));
                              nData.ka.resultsPage.categories[id] = e.target.value;
                              setSiteData(nData);
                            }}
                            className="w-full p-3 bg-gray-50 rounded-xl font-bold text-xs outline-none border border-transparent focus:border-teal-100"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-orange-600 uppercase tracking-widest ml-1">EN</label>
                          <input 
                            value={siteData.en.resultsPage.categories[id] || ''} 
                            onChange={e => {
                              const nData = JSON.parse(JSON.stringify(siteData));
                              nData.en.resultsPage.categories[id] = e.target.value;
                              setSiteData(nData);
                            }}
                            className="w-full p-3 bg-gray-50 rounded-xl font-bold text-xs outline-none border border-transparent focus:border-orange-100"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase tracking-tight text-gray-400 ml-2">Result Items</h3>
                  <button 
                    onClick={() => {
                      const nData = JSON.parse(JSON.stringify(siteData));
                      const newItem = {
                        id: Date.now(),
                        category: 'whitening',
                        before: '',
                        after: '',
                        title: 'ახალი შედეგი',
                        desc: 'შედეგის აღწერა'
                      };
                      const newItemEn = {
                        id: newItem.id,
                        category: 'whitening',
                        before: '',
                        after: '',
                        title: 'New Result',
                        desc: 'Result description'
                      };
                      if (!nData.ka.resultsPage.items) nData.ka.resultsPage.items = [];
                      if (!nData.en.resultsPage.items) nData.en.resultsPage.items = [];
                      nData.ka.resultsPage.items.push(newItem);
                      nData.en.resultsPage.items.push(newItemEn);
                      setSiteData(nData);
                    }} 
                    className="px-6 py-3 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#005a5a] transition-all"
                  >
                    + ახალი შედეგი
                  </button>
                </div>

                <div className="space-y-12">
                  {(siteData.ka.resultsPage.items || []).map((item: any, idx: number) => (
                    <div key={item.id} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8">
                      <div className="flex justify-between items-center border-b border-gray-50 pb-6">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">შედეგი #{idx + 1}</span>
                          <select 
                            value={item.category} 
                            onChange={e => {
                              const nData = JSON.parse(JSON.stringify(siteData));
                              nData.ka.resultsPage.items[idx].category = e.target.value;
                              nData.en.resultsPage.items[idx].category = e.target.value;
                              setSiteData(nData);
                            }}
                            className="bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase outline-none"
                          >
                            {Object.entries(siteData.ka.resultsPage.categories || {}).map(([id, label]: [string, any]) => (
                              <option key={id} value={id}>{label}</option>
                            ))}
                          </select>
                        </div>
                        <button 
                          onClick={() => {
                            if (confirm('ნამდვილად გსურთ წაშლა?')) {
                              const nData = JSON.parse(JSON.stringify(siteData));
                              nData.ka.resultsPage.items.splice(idx, 1);
                              nData.en.resultsPage.items.splice(idx, 1);
                              setSiteData(nData);
                            }
                          }} 
                          className="text-red-400 font-bold uppercase text-[9px] tracking-widest hover:text-red-600 transition-colors"
                        >
                          წაშლა
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <label className="text-[9px] font-black text-teal-600 uppercase block tracking-widest">ქართული ვერსია (KA)</label>
                          <input 
                            value={item.title} 
                            onChange={e => {
                              const nData = JSON.parse(JSON.stringify(siteData));
                              nData.ka.resultsPage.items[idx].title = e.target.value;
                              setSiteData(nData);
                            }} 
                            className="w-full p-4 bg-gray-50 rounded-xl font-black outline-none" 
                            placeholder="სათაური" 
                          />
                          <textarea 
                            value={item.desc} 
                            onChange={e => {
                              const nData = JSON.parse(JSON.stringify(siteData));
                              nData.ka.resultsPage.items[idx].desc = e.target.value;
                              setSiteData(nData);
                            }} 
                            className="w-full p-4 bg-gray-50 rounded-xl font-medium text-sm" 
                            placeholder="აღწერა" 
                            rows={3} 
                          />
                        </div>
                        <div className="space-y-6">
                          <label className="text-[9px] font-black text-orange-600 uppercase block tracking-widest">English Version (EN)</label>
                          <input 
                            value={siteData.en.resultsPage.items[idx]?.title || ''} 
                            onChange={e => {
                              const nData = JSON.parse(JSON.stringify(siteData));
                              nData.en.resultsPage.items[idx].title = e.target.value;
                              setSiteData(nData);
                            }} 
                            className="w-full p-4 bg-orange-50/30 rounded-xl font-black outline-none" 
                            placeholder="Title" 
                          />
                          <textarea 
                            value={siteData.en.resultsPage.items[idx]?.desc || ''} 
                            onChange={e => {
                              const nData = JSON.parse(JSON.stringify(siteData));
                              nData.en.resultsPage.items[idx].desc = e.target.value;
                              setSiteData(nData);
                            }} 
                            className="w-full p-4 bg-orange-50/30 rounded-xl font-medium text-sm" 
                            placeholder="Description" 
                            rows={3} 
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Before (ადრე) URL</label>
                          <div className="flex gap-4 items-center">
                            {item.before && (
                              <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                <img src={item.before} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                              </div>
                            )}
                            <div className="flex-1 space-y-2">
                              <input 
                                value={item.before} 
                                onChange={e => {
                                  const nData = JSON.parse(JSON.stringify(siteData));
                                  nData.ka.resultsPage.items[idx].before = e.target.value;
                                  nData.en.resultsPage.items[idx].before = e.target.value;
                                  setSiteData(nData);
                                }} 
                                className="w-full p-4 bg-gray-50 rounded-xl font-bold text-xs outline-none" 
                                placeholder="https://..." 
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">After (შემდეგ) URL</label>
                          <div className="flex gap-4 items-center">
                            {item.after && (
                              <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                <img src={item.after} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                              </div>
                            )}
                            <div className="flex-1 space-y-2">
                              <input 
                                value={item.after} 
                                onChange={e => {
                                  const nData = JSON.parse(JSON.stringify(siteData));
                                  nData.ka.resultsPage.items[idx].after = e.target.value;
                                  nData.en.resultsPage.items[idx].after = e.target.value;
                                  setSiteData(nData);
                                }} 
                                className="w-full p-4 bg-gray-50 rounded-xl font-bold text-xs outline-none" 
                                placeholder="https://..." 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <InputPair label="About Section Title" path="aboutComp.title" />
              <InputPair label="About Section Description" path="aboutComp.desc" isTextArea={true} />
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="space-y-10">
              <button 
                onClick={() => setBlogPosts([{
                  id: 'new-post-' + Date.now(),
                  title: { ka: '', en: '' },
                  category: { ka: 'სიახლე', en: 'News' },
                  date: new Date().toLocaleDateString('ka-GE'),
                  image: '',
                  excerpt: { ka: '', en: '' },
                  content: { ka: '', en: '' }
                }, ...blogPosts])} 
                className="px-8 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#005a5a] transition-all"
              >
                + ახალი სტატია
              </button>

              <div className="space-y-12">
                {blogPosts.map((post, idx) => (
                  <div key={post.id} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-6">
                       <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">სტატია #{blogPosts.length - idx}</span>
                       <button onClick={() => setBlogPosts(blogPosts.filter(p => p.id !== post.id))} className="text-red-400 font-bold uppercase text-[9px] tracking-widest hover:text-red-600 transition-colors">წაშლა</button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <label className="text-[9px] font-black text-teal-600 uppercase block tracking-widest">ქართული ვერსია (KA)</label>
                          <input value={post.title.ka} onChange={e => { const np = [...blogPosts]; np[idx].title.ka = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-gray-50 rounded-xl font-black outline-none" placeholder="სათაური" />
                          <input value={post.category.ka} onChange={e => { const np = [...blogPosts]; np[idx].category.ka = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-gray-50 rounded-xl font-bold text-xs" placeholder="კატეგორია" />
                          <textarea value={post.excerpt.ka} onChange={e => { const np = [...blogPosts]; np[idx].excerpt.ka = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-gray-50 rounded-xl font-medium text-sm" placeholder="მოკლე აღწერა" rows={3} />
                          <textarea value={post.content.ka} onChange={e => { const np = [...blogPosts]; np[idx].content.ka = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-gray-50 rounded-xl font-medium text-sm" placeholder="სრული ტექსტი" rows={8} />
                       </div>
                       <div className="space-y-6">
                          <label className="text-[9px] font-black text-orange-600 uppercase block tracking-widest">English Version (EN)</label>
                          <input value={post.title.en} onChange={e => { const np = [...blogPosts]; np[idx].title.en = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-orange-50/30 rounded-xl font-black outline-none" placeholder="Title" />
                          <input value={post.category.en} onChange={e => { const np = [...blogPosts]; np[idx].category.en = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-orange-50/30 rounded-xl font-bold text-xs" placeholder="Category" />
                          <textarea value={post.excerpt.en} onChange={e => { const np = [...blogPosts]; np[idx].excerpt.en = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-orange-50/30 rounded-xl font-medium text-sm" placeholder="Short Excerpt" rows={3} />
                          <textarea value={post.content.en} onChange={e => { const np = [...blogPosts]; np[idx].content.en = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-orange-50/30 rounded-xl font-medium text-sm" placeholder="Full Content" rows={8} />
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-4">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">სურათის ლინკი (URL)</label>
                          <div className="flex gap-4 items-center">
                            {post.image && (
                              <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                <img src={post.image} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                              </div>
                            )}
                            <div className="flex-1 space-y-2">
                              <input 
                                value={post.image} 
                                onChange={e => { const np = [...blogPosts]; np[idx].image = e.target.value; setBlogPosts(np); }} 
                                className="w-full p-4 bg-gray-50 rounded-xl font-bold text-xs outline-none" 
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">თარიღი</label>
                          <input value={post.date} onChange={e => { const np = [...blogPosts]; np[idx].date = e.target.value; setBlogPosts(np); }} className="w-full p-4 bg-gray-50 rounded-xl font-bold text-xs h-16" placeholder="მაგ: 12 თებერვალი, 2026" />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-10">
              <button onClick={() => setTeam([...team, { id: Date.now().toString(), name: {ka: '', en: ''}, role: {ka: '', en: ''}, image: '', bio: {ka: '', en: ''}, education: {ka: '', en: ''}, specialization: {ka: '', en: ''}, type: 'doctor' }])} className="px-8 py-3 bg-black text-white rounded-full font-black text-[10px] uppercase">+ ახალი წევრი</button>
              {team.map((m, idx) => (
                <div key={m.id} className={`bg-white p-10 rounded-[4rem] border transition-all ${m.isActive === false ? 'opacity-60 grayscale border-red-100' : 'border-gray-100 shadow-sm'} space-y-6`}>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${m.isActive !== false ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-300'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          {m.isActive !== false ? 'აქტიური' : 'გათიშული'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
                        <button 
                          onClick={() => { const nt = [...team]; nt[idx].type = 'doctor'; setTeam(nt); }}
                          className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${m.type === 'doctor' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-400'}`}
                        >
                          ექიმი
                        </button>
                        <button 
                          onClick={() => { const nt = [...team]; nt[idx].type = 'assistant'; setTeam(nt); }}
                          className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${m.type === 'assistant' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}
                        >
                          ასისტენტი
                        </button>
                        <button 
                          onClick={() => { const nt = [...team]; nt[idx].type = 'administration'; setTeam(nt); }}
                          className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${m.type === 'administration' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-400'}`}
                        >
                          ადმინისტრაცია
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => { const nt = [...team]; nt[idx].isActive = nt[idx].isActive === false ? true : false; setTeam(nt); }}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${m.isActive !== false ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'}`}
                    >
                      {m.isActive !== false ? 'გათიშვა' : 'ჩართვა'}
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[9px] font-black text-teal-600 uppercase">Georgian Info</label>
                        <input value={m.name.ka} onChange={e => { const nt = [...team]; nt[idx].name.ka = e.target.value; setTeam(nt); }} className="w-full p-4 bg-gray-50 rounded-xl font-black" placeholder="სახელი (KA)" />
                        <textarea value={m.bio?.ka} onChange={e => { const nt = [...team]; if(!nt[idx].bio) nt[idx].bio={ka:'',en:''}; nt[idx].bio.ka = e.target.value; setTeam(nt); }} className="w-full p-4 bg-gray-50 rounded-xl" placeholder="ბიოგრაფია (KA)" rows={3} />
                        <textarea value={m.education?.ka} onChange={e => { const nt = [...team]; if(!nt[idx].education) nt[idx].education={ka:'',en:''}; nt[idx].education.ka = e.target.value; setTeam(nt); }} className="w-full p-4 bg-gray-50 rounded-xl" placeholder="განათლება (KA)" rows={2} />
                        <textarea value={m.specialization?.ka} onChange={e => { const nt = [...team]; if(!nt[idx].specialization) nt[idx].specialization={ka:'',en:''}; nt[idx].specialization.ka = e.target.value; setTeam(nt); }} className="w-full p-4 bg-gray-50 rounded-xl" placeholder="სპეციალიზაცია (KA)" rows={2} />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[9px] font-black text-orange-600 uppercase">English Info</label>
                        <input value={m.name.en} onChange={e => { const nt = [...team]; nt[idx].name.en = e.target.value; setTeam(nt); }} className="w-full p-4 bg-orange-50/30 rounded-xl font-black" placeholder="Name (EN)" />
                        <textarea value={m.bio?.en} onChange={e => { const nt = [...team]; if(!nt[idx].bio) nt[idx].bio={ka:'',en:''}; nt[idx].bio.en = e.target.value; setTeam(nt); }} className="w-full p-4 bg-orange-50/30 rounded-xl" placeholder="Bio (EN)" rows={3} />
                        <textarea value={m.education?.en} onChange={e => { const nt = [...team]; if(!nt[idx].education) nt[idx].education={ka:'',en:''}; nt[idx].education.en = e.target.value; setTeam(nt); }} className="w-full p-4 bg-orange-50/30 rounded-xl" placeholder="Education (EN)" rows={2} />
                        <textarea value={m.specialization?.en} onChange={e => { const nt = [...team]; if(!nt[idx].specialization) nt[idx].specialization={ka:'',en:''}; nt[idx].specialization.en = e.target.value; setTeam(nt); }} className="w-full p-4 bg-orange-50/30 rounded-xl" placeholder="Specialization (EN)" rows={2} />
                     </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">ექიმის ფოტოს ლინკი (URL)</label>
                    <div className="flex gap-4 items-center">
                      {m.image && (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                          <img src={m.image} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <input 
                          value={m.image} 
                          onChange={e => { const nt = [...team]; nt[idx].image = e.target.value; setTeam(nt); }} 
                          className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none" 
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { if(confirm('ნამდვილად გსურთ წაშლა?')) setTeam(team.filter(x => x.id !== m.id))}} className="text-red-400 font-bold uppercase text-[10px] hover:text-red-600 transition-colors">ექიმის წაშლა</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-10">
              <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-400 ml-2">Page Header & Image</h3>
                <InputPair label="Price Page Hero Image" path="media.price_hero" isImage={true} />
                <InputPair label="Price Page Header Text" path="pricePage.heroTitle" />
              </div>
              {siteData.ka.pricePage.categories.map((cat: any, cIdx: number) => (
                <div key={cIdx} className="bg-white p-10 rounded-[4rem] shadow-sm border border-gray-100 space-y-6">
                  <InputPair label="Category Name" path={`pricePage.categories.${cIdx}.name`} />
                  <div className="space-y-4">
                    {cat.items.map((item: any, iIdx: number) => (
                      <div key={iIdx} className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-transparent hover:border-teal-100 transition-all">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-teal-600 uppercase tracking-widest ml-1">KA Name</label>
                            <input className="w-full p-3 bg-white rounded-xl font-bold text-sm outline-none border border-gray-100 focus:border-teal-200" value={item.n} onChange={e => {
                              const nData = JSON.parse(JSON.stringify(siteData));
                              nData.ka.pricePage.categories[cIdx].items[iIdx].n = e.target.value;
                              setSiteData(nData);
                            }} placeholder="სერვისის სახელი" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-orange-600 uppercase tracking-widest ml-1">EN Name</label>
                            <input className="w-full p-3 bg-white rounded-xl font-bold text-sm outline-none border border-gray-100 focus:border-orange-200" value={siteData.en.pricePage.categories[cIdx].items[iIdx]?.n || ''} onChange={e => {
                              const nData = JSON.parse(JSON.stringify(siteData));
                              if (!nData.en.pricePage.categories[cIdx].items[iIdx]) {
                                nData.en.pricePage.categories[cIdx].items[iIdx] = { n: '', p: item.p };
                              }
                              nData.en.pricePage.categories[cIdx].items[iIdx].n = e.target.value;
                              setSiteData(nData);
                            }} placeholder="Service Name" />
                          </div>
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="flex-1 space-y-1">
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Price / ფასი</label>
                            <input className="w-full p-3 bg-white rounded-xl font-black text-teal-600 outline-none border border-gray-100 focus:border-teal-200" value={item.p} onChange={e => {
                              const nData = JSON.parse(JSON.stringify(siteData));
                              nData.ka.pricePage.categories[cIdx].items[iIdx].p = e.target.value;
                              if (nData.en.pricePage.categories[cIdx].items[iIdx]) {
                                nData.en.pricePage.categories[cIdx].items[iIdx].p = e.target.value;
                              }
                              setSiteData(nData);
                            }} placeholder="მაგ: 50₾" />
                          </div>
                          <button className="mt-5 p-3 text-red-300 hover:text-red-600 transition-colors" title="წაშლა" onClick={() => {
                            const nData = JSON.parse(JSON.stringify(siteData));
                            nData.ka.pricePage.categories[cIdx].items.splice(iIdx, 1);
                            nData.en.pricePage.categories[cIdx].items.splice(iIdx, 1);
                            setSiteData(nData);
                          }}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-4 bg-teal-50 text-teal-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-teal-100 transition-all" onClick={() => {
                       const nData = JSON.parse(JSON.stringify(siteData));
                       nData.ka.pricePage.categories[cIdx].items.push({n: 'ახალი სერვისი', p: '0₾'});
                       nData.en.pricePage.categories[cIdx].items.push({n: 'New Service', p: '0₾'});
                       setSiteData(nData);
                    }}>+ ახალი ფასის დამატება</button>
                  </div>
                </div>
              ))}
              <button onClick={() => {
                  const nData = JSON.parse(JSON.stringify(siteData));
                  nData.ka.pricePage.categories.push({ name: 'ახალი კატეგორია', items: [] });
                  nData.en.pricePage.categories.push({ name: 'New Category', items: [] });
                  setSiteData(nData);
              }} className="w-full py-6 bg-black text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-[#005a5a] transition-all">
                + ახალი კატეგორიის დამატება
              </button>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-400 ml-2">Hero Slides</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputPair label="Hero Slide 1" path="media.hero_slide_1" isImage={true} />
                  <InputPair label="Hero Slide 2" path="media.hero_slide_2" isImage={true} />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-teal-600 ml-2">Page Headers (მთავარი ბანერები)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputPair label="Price Page Hero (ფასების გვერდი)" path="media.price_hero" isImage={true} />
                  <InputPair label="About Page Hero (შესახებ გვერდი)" path="media.about_hero" isImage={true} />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-400 ml-2">Other Banners</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputPair label="About History" path="media.about_history" isImage={true} />
                  <InputPair label="About Home Section" path="media.about_home" isImage={true} />
                  <InputPair label="Treatment 1" path="media.treatment_1" isImage={true} />
                  <InputPair label="Treatment 2" path="media.treatment_2" isImage={true} />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-400 ml-2">Equipment</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputPair label="Equipment 1" path="media.equipment_1" isImage={true} />
                  <InputPair label="Equipment 2" path="media.equipment_2" isImage={true} />
                  <InputPair label="Equipment 3" path="media.equipment_3" isImage={true} />
                  <InputPair label="Equipment 4" path="media.equipment_4" isImage={true} />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-400 ml-2">Service Images</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputPair label="Orthopedics" path="media.service_orthopedics" isImage={true} />
                  <InputPair label="Pediatrics" path="media.service_pediatrics" isImage={true} />
                  <InputPair label="Surgery" path="media.service_surgery" isImage={true} />
                  <InputPair label="Endodontics" path="media.service_endodontics" isImage={true} />
                  <InputPair label="Aesthetics" path="media.service_aesthetics" isImage={true} />
                  <InputPair label="Implantology" path="media.service_implantology" isImage={true} />
                  <InputPair label="Orthodontics" path="media.service_orthodontics" isImage={true} />
                  <InputPair label="Periodontology" path="media.service_periodontology" isImage={true} />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-400 ml-2">Branding</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputPair label="Main Logo" path="media.logo" isImage={true} />
                  <InputPair label="Facebook Icon" path="media.fb_icon" isImage={true} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="space-y-6">
              <InputPair label="Footer Description" path="footer.desc" isTextArea={true} />
              <InputPair label="Facebook Name" path="footer.fb" />
              <InputPair label="Opening Hours Title" path="footer.hours" />
              <InputPair label="Contact Title" path="footer.contact" />
              <InputPair label="Button Text" path="footer.btn" />
              <InputPair label="Copyright Text" path="footer.copy" />
              <InputPair label="Privacy Policy Text" path="footer.policy" />
              <InputPair label="Terms Text" path="footer.terms" />
              <InputPair label="Address" path="common.address" />
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-gray-100">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">პაციენტი</th>
                      <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">ექიმი და ჩივილი</th>
                      <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">თარიღი</th>
                      <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">ქმედება</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leads.map(l => (
                      <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-8">
                          <p className="font-black text-gray-900">{l.name}</p>
                          <p className="text-xs text-[#005a5a] font-bold mt-1">{l.phone}</p>
                        </td>
                        <td className="p-8">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Dr. {l.doctor}</p>
                          <p className="text-sm italic text-gray-600 mt-2">"{l.concern}"</p>
                        </td>
                        <td className="p-8 text-xs font-bold text-gray-400">{l.date}</td>
                        <td className="p-8">
                          <button onClick={() => { if(confirm('ნამდვილად გსურთ ამ ჯავშნის წაშლა?')) API.deleteLead(l.id).then(() => setLeads(leads.filter(x => x.id !== l.id))) }} className="text-red-400 font-bold text-[10px] uppercase hover:text-red-600 transition-colors">წაშლა</button>
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 && (
                      <tr><td colSpan={4} className="p-20 text-center text-gray-300 font-black uppercase tracking-widest text-xs">ჯავშნები ჯერ არ არის</td></tr>
                    )}
                  </tbody>
               </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
