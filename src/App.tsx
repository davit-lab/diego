import React, { useState, useEffect, useRef } from "react";
import { 
  Upload, Folder, File, ExternalLink, X, Check, Loader2, Trash2, 
  Save, Play, Plus, RefreshCw, ChevronRight, ChevronDown, Edit3, 
  FileCode, Terminal, Layout, Cpu, Globe, Rocket, Shield, Zap, Sparkles,
  ShoppingCart, User, LogIn, LogOut, CreditCard, ArrowRight, Activity,
  Archive, Files, Github
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

export default function App() {
  const [language, setLanguage] = useState<"en" | "ka">("en");
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"domains" | "upload" | "edit" | "preview">("domains");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [githubUrl, setGithubUrl] = useState("");
  const [previewDomain, setPreviewDomain] = useState("preview.cloudzero.network");

  const trans = {
    en: {
      domains: "Domains",
      deploy: "Deploy",
      editor: "Editor",
      plans: "Plans",
      liveView: "Live View",
      account: "Account",
      terminate: "Terminate Session",
      initSession: "Initialize Session",
      session: "Session",
      live: "Live",
      refresh: "Refresh",
      external: "External",
      note: "Note: Console websocket warnings are artifacts of the proxy and do not affect runtime.",
      nodeReady: "Node Ready",
      propagationInit: "Propagation Initialized",
      envReady: "Environment Ready",
      emptyRepo: "Empty Repository",
      projExplorer: "Project Explorer",
      claimIdentity: "Claim Your Digital Identity.",
      acquireAssets: "Acquire high-premium assets on the decentralized CloudZero backbone.",
      searchPlaceholder: "Search unique namespaces...",
      verifyAvailability: "Verify Availability",
      availableResults: "Available Results",
      myPortfolio: "My Portfolio",
      addToCart: "Add to Cart",
      manage: "Manage",
      linked: "Linked to Site",
      link: "Link to Site",
      premiumAsset: "Premium Asset",
      standardTier: "Standard Tier",
      found: "FOUND",
      awaitingRegistry: "Awaiting Registry Query",
      configuration: "Configuration",
      domainLabel: "Domain",
      clusterMapping: "Cluster Mapping",
      security: "Security",
      protocolLabel: "Protocol",
      updateProp: "Update Propagation",
      detachDomain: "Detach Domain",
      kernelLogin: "Kernel Login",
      nodeSignup: "Node Signup",
      identityLabel: "Identity",
      secretKey: "Secret Key",
      authenticate: "Authenticate",
      createAccount: "Create Account",
      needNode: "Need a node?",
      alreadyIdentity: "Already have identity?",
      toggleMode: "Toggle Mode",
      pipeline: "Your Pipeline",
      stagedAssets: "Staged Assets for Deployment",
      emptyPipeline: "Empty Pipeline",
      totalInvestment: "Total Investment",
      finalizeAcq: "Finalize Acquisition",
      computePrecision: "Compute Precision",
      selectEfficiency: "Select your execution efficiency tier",
      activeCore: "Active Core",
      unlimited: "Unlimited",
      total: "Total",
      noWatermark: "No Watermark",
      watermark: "Watermark Present",
      enterpriseInfra: "Enterprise Infrastructure",
      contactCustom: "Contact for custom cluster configurations",
      initNegotiation: "Initialize Negotiation",
      upgradeTier: "Upgrade Tier",
      fileBuffer: "File Buffer",
      rootStruct: "Root Structure",
      branding: "Branding",
      awaitingNode: "Kernel Standby // Awaiting Node",
      kernelBuffer: "Kernel Buffer",
      saveBuffer: "Save Buffer"
    },
    ka: {
      domains: "დომენები",
      deploy: "დეპლოი",
      editor: "რედაქტორი",
      plans: "გეგმები",
      liveView: "Live ხედი",
      account: "ანგარიში",
      terminate: "სესიის დასრულება",
      initSession: "სესიის ინიციალიზაცია",
      session: "სესია",
      live: "ლაივი",
      refresh: "განახლება",
      external: "გარე ბმული",
      note: "შენიშვნა: Console websocket გაფრთხილებები პროქსის არტეფაქტებია და არ მოქმედებს მუშაობაზე.",
      nodeReady: "კვანძი მზადაა",
      propagationInit: "პროპაგაცია ინიციალიზებულია",
      envReady: "გარემო მზადაა",
      emptyRepo: "ცარიელი რეპოზიტორია",
      projExplorer: "პროექტის გამომკვლევი",
      claimIdentity: "დაიკავეთ თქვენი ციფრული იდენტობა.",
      acquireAssets: "შეიძინეთ მაღალი პრემიუმ აქტივები დეცენტრალიზებულ CloudZero ხერხემალზე.",
      searchPlaceholder: "მოძებნეთ უნიკალური სახელები...",
      verifyAvailability: "შეამოწმეთ ხელმისაწვდომობა",
      availableResults: "ხელმისაწვდომი შედეგები",
      myPortfolio: "ჩემი პორტფოლიო",
      addToCart: "კალათაში დამატება",
      manage: "მართვა",
      linked: "დაკავშირებულია",
      link: "საიტთან დაკავშირება",
      premiumAsset: "პრემიუმ აქტივი",
      standardTier: "სტანდარტული ტიპი",
      found: "ნაპოვნია",
      awaitingRegistry: "ველოდებით რეესტრის პასუხს",
      configuration: "კონფიგურაცია",
      domainLabel: "დომენი",
      clusterMapping: "კლასტერის ასახვა",
      security: "უსაფრთხოება",
      protocolLabel: "პროტოკოლი",
      updateProp: "პროპაგაციის განახლება",
      detachDomain: "დომენის მოცილება",
      kernelLogin: "ბირთვში შესვლა",
      nodeSignup: "კვანძის რეგისტრაცია",
      identityLabel: "იდენტობა",
      secretKey: "საიდუმლო გასაღები",
      authenticate: "ავტორიზაცია",
      createAccount: "ანგარიშის შექმნა",
      needNode: "გჭირდებათ კვანძი?",
      alreadyIdentity: "უკვე გაქვთ იდენტობა?",
      toggleMode: "რეჟიმის შეცვლა",
      pipeline: "თქვენი მილსადენი",
      stagedAssets: "განლაგებისთვის მომზადებული აქტივები",
      emptyPipeline: "მილსადენი ცარიელია",
      totalInvestment: "ჯამური ინვესტიცია",
      finalizeAcq: "აკვიზიციის დასრულება",
      computePrecision: "გამოთვლის სიზუსტე",
      selectEfficiency: "აირჩიეთ თქვენი შესრულების ეფექტურობის იარუსი",
      activeCore: "აქტიური ბირთვი",
      unlimited: "შეუზღუდავი",
      total: "ჯამში",
      noWatermark: "წყლის ნიშნის გარეშე",
      watermark: "წყლის ნიშნით",
      enterpriseInfra: "საწარმოო ინფრასტრუქტრურა",
      contactCustom: "დაგვიკავშირდით კლასტერის ინდივიდუალური კონფიგურაციისთვის",
      initNegotiation: "მოლაპარაკების ინიცირება",
      upgradeTier: "იარუსის განახლება",
      fileBuffer: "ფაილების ბუფერი",
      rootStruct: "ძირეული სტრუქტურა",
      branding: "ბრენდინგი",
      awaitingNode: "ბირთვი მოლოდინში // ველოდებით კვანძს",
      kernelBuffer: "ბირთვის ბუფერი",
      saveBuffer: "ბუფერის შენახვა"
    }
  };

  const t = trans[language];

  const [isManageDomainOpen, setIsManageDomainOpen] = useState(false);
  const [managingDomain, setManagingDomain] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ action: string; time: string; status: string }[]>([
    { action: "Baseline established", time: "System Init", status: "Stable" },
    { action: "Core nodes initialized", time: "Boot", status: "Active" }
  ]);
  const previewFrameRef = useRef<HTMLIFrameElement>(null);

  const addLog = (action: string, status: string = "Success") => {
    setLogs(prev => [
      { action, time: "Just now", status },
      ...prev.slice(0, 4)
    ]);
  };
  
  // Domain State
  const [domainQuery, setDomainQuery] = useState("");
  const [domainResults, setDomainResults] = useState<any[]>([]);
  const [myDomains, setMyDomains] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [plans, setPlans] = useState<any>({
    free: { name: "Quantum Free", price: 0, fileLimit: 100, folderLimit: 20, watermark: true },
    pro: { name: "Hyper Pro", price: 49, fileLimit: 5000, folderLimit: 500, watermark: false },
    enterprise: { name: "Nebula Enterprise", price: 299, fileLimit: Infinity, folderLimit: Infinity, watermark: false }
  });

  // Auth & Cart State
  const [user, setUser] = useState<{ email: string; balance: number; plan: string } | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    fetchFileTree();
    fetchMyDomains();
    checkAuth();
    fetchCart();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {}
  };

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (err) {}
  };

  const handleAuth = async () => {
    try {
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("cz_user", JSON.stringify({ email: authEmail, password: authPassword }));
        setIsAuthOpen(false);
        setMessage({ type: "success", text: `${authMode === "login" ? "Welcome back" : "Account created"}` });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Authentication failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Auth error" });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cz_user");
    setMessage({ type: "success", text: "Session terminated" });
    addLog("Session safely terminated", "Stable");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("cz_user");
    if (savedUser && !user) {
      const { email, password } = JSON.parse(savedUser);
      // Attempt auto-login
      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).then(res => res.json()).then(data => {
        if (data.success) {
          setUser(data.user);
          addLog("Auto-authentication successful", "Active");
        }
      }).catch(() => {});
    }
  }, []);

  const addToCart = async (domain: any) => {
    if (cart.find(c => c.id === domain.id)) {
      setMessage({ type: "error", text: "Already in cart" });
      return;
    }
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(domain),
      });
      if (res.ok) {
        fetchCart();
        setMessage({ type: "success", text: "Added to cart" });
      }
    } catch (err) {}
  };

  const removeFromCart = async (id: string) => {
    try {
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchCart();
    } catch (err) {}
  };

  const checkout = async () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setUser(prev => prev ? { ...prev, balance: data.balance } : null);
        setCart([]);
        fetchMyDomains();
        setIsCartOpen(false);
        setMessage({ type: "success", text: "Purchase complete" });
        addLog(`Acquired ${cart.length} domains`, "Success");
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Checkout failed" });
      }
    } catch (err) {} finally {
      setIsCheckingOut(false);
    }
  };

  const linkDomainToSite = async (domain: string) => {
    try {
      const res = await fetch("/api/domains/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, path: "/" }),
      });
      if (res.ok) {
        fetchMyDomains();
        setMessage({ type: "success", text: `Domain mapped to root` });
        addLog(`Mapped ${domain} to root`, "Active");
      }
    } catch (err) {}
  };

  const upgradePlan = async (planId: string) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    try {
      const res = await fetch("/api/auth/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(prev => prev ? { ...prev, plan: data.plan, balance: data.balance } : null);
        setMessage({ type: "success", text: `Active plan: ${plans[planId].name}` });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Upgrade failed" });
      }
    } catch (err) {}
  };

  const fetchMyDomains = async () => {
    try {
      const res = await fetch("/api/domains/my");
      const data = await res.json();
      setMyDomains(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDomainSearch = async () => {
    if (!domainQuery) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/domains/search?q=${encodeURIComponent(domainQuery)}`);
      const data = await res.json();
      setDomainResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchFileTree = async () => {
    try {
      const res = await fetch("/api/hosted/files");
      const data = await res.json();
      setFileTree(data || []);
    } catch (err) {
      console.error("Failed to fetch tree", err);
    }
  };

  const handleFileSelect = async (path: string) => {
    setSelectedFile(path);
    setActiveTab("edit");
    try {
      const res = await fetch(`/api/hosted/read?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      setFileContent(data.content || "");
    } catch (err) {
      console.error("Failed to read file", err);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/hosted/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: selectedFile, content: fileContent }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Changes deployed successfully" });
        addLog(`Modified ${selectedFile}`, "Updated");
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setMessage({ type: "error", text: "Deployment failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async (isDirectory: boolean) => {
    const name = prompt(`Enter ${isDirectory ? "folder" : "file"} name:`);
    if (!name) return;
    try {
      const res = await fetch("/api/hosted/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: name, isDirectory }),
      });
      if (res.ok) fetchFileTree();
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  const handleDelete = async (path: string) => {
    if (!confirm(`Permanently delete ${path}?`)) return;
    try {
      const res = await fetch("/api/hosted/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      if (res.ok) {
        if (selectedFile === path) {
          setSelectedFile(null);
          setFileContent("");
        }
        fetchFileTree();
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("zipFile", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        setMessage({ type: "success", text: "ARCHIVE_SYNC_COMPLETE :: Nodes active." });
        addLog("Archive bundle synchronized", "Success");
        fetchFileTree();
        setActiveTab("preview");
        if (previewFrameRef.current) previewFrameRef.current.src = previewFrameRef.current.src;
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "SYNC_REJECTED" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "SYNC_PROTOCOL_FAULT" });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    try {
      const res = await fetch("/api/upload-files", { method: "POST", body: formData });
      if (res.ok) {
        setMessage({ type: "success", text: `ATOMIC_SYNC :: ${files.length} nodes active.` });
        addLog(`${files.length} nodes synchronized`, "Success");
        fetchFileTree();
        setActiveTab("preview");
        if (previewFrameRef.current) previewFrameRef.current.src = previewFrameRef.current.src;
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "SYNC_REJECTED" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "SYNC_PROTOCOL_FAULT" });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleGitImport = async () => {
    if (!githubUrl) return;
    setIsUploading(true);
    try {
      const res = await fetch("/api/import/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: githubUrl }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "GIT_IMPORT_SYNC :: Source active." });
        addLog(`Imported ${githubUrl}`, "Success");
        setGithubUrl("");
        fetchFileTree();
        setActiveTab("preview");
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "IMPORT_REJECTED" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "GIT_PROTOCOL_FAULT" });
    } finally {
      setIsUploading(false);
    }
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) newExpanded.delete(path);
    else newExpanded.add(path);
    setExpandedFolders(newExpanded);
  };

  const FileTreeItem = ({ item, depth = 0, ...props }: { item: any; depth?: number; [key: string]: any }) => {
    const isExpanded = expandedFolders.has(item.path);
    const isSelected = selectedFile === item.path;

    return (
      <div {...props}>
        <div 
          className={`flex items-center gap-2.5 py-2 px-3 cursor-pointer rounded-xl transition-all duration-200 group ${
            isSelected 
              ? "bg-white/10 text-white shadow-inner" 
              : "text-slate-500 hover:bg-white/5"
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => item.isDirectory ? toggleFolder(item.path) : handleFileSelect(item.path)}
        >
          {item.isDirectory ? (
            isExpanded ? <ChevronDown className="w-4 h-4 opacity-30" /> : <ChevronRight className="w-4 h-4 opacity-30" />
          ) : (
            <FileCode className={`w-4 h-4 ${isSelected ? "text-violet-400" : "text-slate-600"}`} />
          )}
          {item.isDirectory && <Folder className={`w-4 h-4 ${isSelected ? "text-violet-500" : "text-slate-700"} fill-current opacity-20`} />}
          <span className={`truncate flex-1 text-xs font-bold leading-none ${isSelected ? "text-white" : "text-slate-500"}`}>{item.name}</span>
          {!item.isDirectory && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleDelete(item.path); }}
              className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 transition-all ${
                isSelected ? "text-slate-500" : ""
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {item.isDirectory && isExpanded && item.children?.map((child: any) => (
          <FileTreeItem key={child.path} item={child} depth={depth + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#020203] overflow-hidden font-sans text-slate-400 selection:bg-violet-500/30">
      {/* Sidebar - Technical Rail */}
      <aside className="w-20 bg-[#08080A] border-r border-white/5 flex flex-col items-center py-10 z-50">
        <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center mb-16 shadow-2xl shadow-violet-900/20 group cursor-pointer overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Zap className="w-6 h-6 text-white fill-current" />
        </div>
        
                  <nav className="flex flex-col gap-6">
            {[
              { id: "domains", icon: Globe, label: t.domains },
              { id: "upload", icon: Layout, label: t.deploy },
              { id: "edit", icon: Terminal, label: t.editor },
              { id: "plans", icon: Activity, label: t.plans },
              { id: "preview", icon: ExternalLink, label: t.liveView }
            ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all relative group ${
                activeTab === item.id 
                  ? "bg-white/10 text-white shadow-inner" 
                  : "text-slate-600 hover:text-slate-400"
              }`}
              title={item.label}
            >
              {activeTab === item.id && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-violet-500 rounded-r-full"
                />
              )}
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-6">
          <button 
            onClick={() => {
              fetchFileTree();
              if (previewFrameRef.current) previewFrameRef.current.src = previewFrameRef.current.src;
              addLog("Cluster state refreshed", "Active");
            }} 
            className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-slate-400 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-500 overflow-hidden">
            <Shield className="w-4 h-4 opacity-40 text-violet-500" />
          </div>
        </div>
      </aside>

      {/* Sub-Sidebar for File Management (only shown in edit mode or when relevant) */}
      <AnimatePresence>
        {(activeTab === "edit" || activeTab === "upload") && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-[#08080A] border-r border-white/5 flex flex-col z-40 overflow-hidden"
          >
            <div className="p-10 pb-6 shrink-0">
              <div className="flex items-center justify-between mb-8">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{t.projExplorer}</span>
                 <button onClick={() => handleCreate(false)} className="p-2 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all">
                   <Plus className="w-4 h-4" />
                 </button>
              </div>
              
              <div className="mb-10 bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.envReady}</span>
                </div>
                <div className="text-xs font-mono text-slate-300">Production Build 1.0</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-20 scrollbar-hide">
              {fileTree.length === 0 ? (
                <div className="p-10 text-center rounded-[2.5rem] bg-white/5 border border-white/5 border-dashed flex flex-col items-center">
                  <Cpu className="w-6 h-6 text-slate-700 mb-4" />
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-loose text-center">{t.emptyRepo}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {fileTree.map((item: any) => <FileTreeItem key={item.path} item={item} />)}
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Header - Unified Desktop style */}
        <header className="h-24 flex items-center justify-between px-16 bg-[#020203]/80 backdrop-blur-3xl border-b border-white/5 z-40">
            <div className="flex items-center gap-10">
              <h1 className="font-black text-xl tracking-tighter text-white">Cloud<span className="text-violet-500">Zero</span></h1>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-4 bg-white/5 p-1 px-3 rounded-lg border border-white/5">
                <button 
                  onClick={() => setLanguage("ka")}
                  className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded transition-all ${language === 'ka' ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}
                >
                  GE
                </button>
                <div className="w-px h-2 bg-white/10" />
                <button 
                  onClick={() => setLanguage("en")}
                  className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded transition-all ${language === 'en' ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}
                >
                  EN
                </button>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                <span className="opacity-40">{t.session} ::</span>
                <span className="text-white">ID-992-ALPHA</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-4 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-emerald-500">{t.live}</span>
              </div>
            </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-2xl border border-white/5 group relative cursor-pointer">
                <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white font-black text-xs">
                   {user.email[0].toUpperCase()}
                </div>
                <div>
                   <p className="text-[10px] font-black text-white leading-none">{t.account}</p>
                   <p className="text-[10px] font-mono text-slate-500 mt-1">${user.balance.toLocaleString()} • <span className="text-violet-500">{user.plan.toUpperCase()}</span></p>
                </div>
                
                {/* Logout Tooltip */}
                <button 
                  onClick={logout}
                  className="absolute -bottom-16 right-0 bg-[#0A0A0C] border border-white/10 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500/10 z-[60]"
                >
                  {t.terminate}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setAuthMode("login"); setIsAuthOpen(true); }}
                className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-black transition-all"
              >
                <LogIn className="w-4 h-4" />
                {t.initSession}
              </button>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all border border-white/5"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-lg animate-bounce">
                  {cart.length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {selectedFile && activeTab === "edit" && (
                <motion.button 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-white text-black px-8 py-3 rounded-xl text-xs font-black flex items-center gap-3 transition-all hover:bg-violet-500 hover:text-white disabled:opacity-20"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {t.saveBuffer}
                </motion.button>
              )}
            </AnimatePresence>
            <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
               <div className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white cursor-pointer transition-colors">
                  <Shield className="w-4 h-4" />
               </div>
               <div className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white cursor-pointer transition-colors border-l border-white/5">
                  <ExternalLink onClick={() => window.open('/hosted', '_blank')} className="w-4 h-4" />
               </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-12 overflow-hidden overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === "domains" && (
              <motion.div 
                key="domains"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                className="max-w-7xl mx-auto space-y-12 pb-24"
              >
                {/* Search Hero */}
                <section className="relative p-20 rounded-[4rem] bg-gradient-to-br from-violet-600/20 via-transparent to-transparent border border-white/5 overflow-hidden">
                  <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[120px]" />
                  </div>
                  
                  <div className="relative max-w-2xl">
                    <h2 className="text-6xl font-black text-white tracking-tighter mb-6 leading-[0.9]">{t.claimIdentity}</h2>
                    <p className="text-slate-400 font-bold mb-10 text-lg">{t.acquireAssets}</p>
                    
                    <div className="relative group">
                      <div className="absolute inset-0 bg-violet-600/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                      <div className="relative flex p-2 bg-[#0A0A0C] border border-white/10 rounded-[2rem] shadow-2xl glass-panel">
                        <input 
                          type="text"
                          value={domainQuery}
                          onChange={(e) => setDomainQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleDomainSearch()}
                          placeholder={t.searchPlaceholder}
                          className="flex-1 bg-transparent border-none focus:outline-none px-10 text-white font-black text-lg placeholder:text-slate-700"
                        />
                        <button 
                          onClick={handleDomainSearch}
                          disabled={isSearching}
                          className="bg-white text-black px-10 py-5 rounded-[1.4rem] font-black text-sm transition-all hover:bg-violet-500 hover:text-white flex items-center gap-4"
                        >
                          {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : t.verifyAvailability}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Results Pillar */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between px-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{t.availableResults}</span>
                      {domainResults.length > 0 && (
                        <span className="text-[10px] font-mono text-violet-500 uppercase tracking-widest">{domainResults.length} {t.found}</span>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {domainResults.length === 0 ? (
                        <div className="p-20 text-center rounded-[3rem] border border-white/5 bg-white/[0.02] flex flex-col items-center">
                           <Globe className="w-12 h-12 text-slate-800 mb-6" />
                           <p className="text-slate-600 font-black tracking-widest text-[10px] uppercase">{t.awaitingRegistry}</p>
                        </div>
                      ) : (
                        domainResults.map((domain, i) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={domain.name}
                            className="group relative h-28 bg-[#0A0A0C] border border-white/5 rounded-[2rem] flex items-center justify-between p-10 hover:border-violet-500/50 transition-all"
                          >
                            <div className="flex items-center gap-8">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${domain.premium ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                                <Zap className={`w-6 h-6 ${domain.premium ? 'fill-current' : ''}`} />
                              </div>
                              <div>
                                <h3 className="text-xl font-black text-white group-hover:text-violet-400 transition-colors">{domain.name}</h3>
                                <div className="flex items-center gap-4 mt-2">
                                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{domain.premium ? 'Premium Asset' : 'Standard Tier'}</span>
                                   <div className="w-1 h-1 rounded-full bg-slate-800" />
                                   <span className="text-[10px] font-mono text-emerald-500 uppercase">Available</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-8">
                               <span className="text-xl font-mono text-white tracking-tighter">{domain.priceStr || '$12'}</span>
                               <button 
                                onClick={() => addToCart(domain)}
                                className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-violet-600 hover:text-white"
                               >
                                 {t.addToCart}
                               </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Portfolio Pillar */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{t.myPortfolio}</span>
                    </div>

                    <div className="bg-[#0A0A0C] border border-white/5 rounded-[3rem] p-4 flex flex-col gap-4">
                       {myDomains.length === 0 ? (
                         <div className="p-12 text-center">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No assets secured</p>
                         </div>
                       ) : (
                         myDomains.map((domain, i) => (
                           <div key={domain.name} className="p-6 bg-white/5 rounded-[2rem] border border-white/2">
                              <div className="flex items-center justify-between mb-4">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                  domain.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                  {domain.status}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">{domain.expiry}</span>
                              </div>
                              <h4 className="text-lg font-black text-white">{domain.name}</h4>
                              <div className="mt-6 flex gap-2">
                                 {domain.linked ? (
                                   <button 
                                     onClick={() => { setManagingDomain(domain.name); setIsManageDomainOpen(true); }}
                                     className="flex-1 py-3 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-xl text-center flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all"
                                   >
                                      <Check className="w-3 h-3" /> {t.linked} :: {t.manage}
                                   </button>
                                 ) : (
                                   <button 
                                    onClick={() => linkDomainToSite(domain.name)}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                   >
                                     {t.link}
                                   </button>
                                 )}
                                 <button className="w-12 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl transition-all">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </div>
                         ))
                       )}
                    </div>

                    <div className="bg-violet-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-violet-900/20 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
                       <Sparkles className="w-10 h-10 mb-8 opacity-40" />
                       <h3 className="text-2xl font-black mb-4">Enterprise Guard</h3>
                       <p className="text-violet-100 text-xs font-bold leading-relaxed mb-8 opacity-80">
                         Automated WHOIS privacy and DNSSEC encryption active for all CloudZero assets.
                       </p>
                       <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} animate={{ width: '82%' }}
                            className="h-full bg-white shadow-[0_0_12px_white]"
                          />
                       </div>
                       <p className="mt-4 text-[9px] font-black uppercase tracking-widest opacity-60">Protection Level :: 82%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "upload" && (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
                className="max-w-7xl mx-auto space-y-12 pb-24"
              >
                <div className="text-center mb-16">
                   <h2 className="text-6xl font-black text-white tracking-widest uppercase mb-4">Launchpad</h2>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em]">Deploy your project to the CloudZero network</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   {/* Archive Deployment Card */}
                   <div className="bg-[#0A0A0C] p-12 rounded-[4rem] border border-white/5 group hover:border-violet-500/30 transition-all relative overflow-hidden flex flex-col justify-between h-[500px]">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div>
                        <div className="flex items-center gap-6 mb-12">
                          <div className="w-16 h-16 bg-violet-600/10 rounded-3xl flex items-center justify-center text-violet-500 group-hover:scale-110 transition-transform shadow-2xl shadow-violet-900/20">
                            <Rocket className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-white tracking-widest uppercase">Project Bundle</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Upload a ZIP archive of your site</p>
                          </div>
                        </div>

                        <div className="relative group/drop h-56">
                           <input 
                            type="file" 
                            accept=".zip"
                            onChange={handleZipUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                           />
                           <div className="h-full border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center p-8 group-hover/drop:border-violet-500/50 group-hover/drop:bg-violet-600/5 transition-all">
                              <Archive className="w-10 h-10 text-slate-600 mb-6 group-hover/drop:text-violet-400 group-hover/drop:scale-110 transition-all" />
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Select Archive</p>
                              <p className="text-[10px] font-mono text-slate-700">Max size: 150MB</p>
                           </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-white/5">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Network Protocol</span>
                           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Connection Active</span>
                        </div>
                      </div>
                   </div>

                   {/* Individual Source Sync */}
                   <div className="bg-[#0A0A0C] p-12 rounded-[4rem] border border-white/5 group hover:border-emerald-500/30 transition-all relative overflow-hidden flex flex-col justify-between h-[500px]">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div>
                        <div className="flex items-center gap-6 mb-12">
                          <div className="w-16 h-16 bg-emerald-600/10 rounded-3xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform shadow-2xl shadow-emerald-900/20">
                            <Files className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-white tracking-widest uppercase">Quick Deploy</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Upload individual project files</p>
                          </div>
                        </div>

                        <div className="relative group/drop h-56">
                           <input 
                            type="file" 
                            multiple
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                           />
                           <div className="h-full border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center p-8 group-hover/drop:border-emerald-500/50 group-hover/drop:bg-emerald-600/5 transition-all">
                              <RefreshCw className="w-10 h-10 text-slate-600 mb-6 group-hover/drop:text-emerald-400 group-hover/drop:rotate-180 transition-all duration-1000" />
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Batch Synchronize</p>
                              <p className="text-[10px] font-mono text-slate-700 uppercase">Limit: {user ? (plans[user.plan].fileLimit === Infinity ? "Unlimited" : `${plans[user.plan].fileLimit} Files`) : "Checking..."}</p>
                           </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-white/5">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Transfer Mode</span>
                           <span className="text-[10px] font-bold text-slate-300 italic">Atomic</span>
                        </div>
                      </div>
                   </div>

                   {/* GitHub Import Card */}
                   <div className="bg-[#0A0A0C] p-12 rounded-[4rem] border border-white/5 lg:col-span-2 group hover:border-slate-500/30 transition-all relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
                      <div className="absolute top-0 left-0 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all shadow-2xl">
                            <Github className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-white tracking-widest uppercase">Git Synchronization</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Mirror public repositories to CloudZero</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-md">Connect your repository directly. We'll automatically clone, optimize, and deploy the source nodes to your active cluster.</p>
                      </div>

                      <div className="flex-1 w-full flex flex-col gap-4">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="https://github.com/user/repo"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-mono text-white focus:outline-none focus:border-white/30 transition-all"
                          />
                        </div>
                        <button 
                          onClick={handleGitImport}
                          disabled={!githubUrl || isUploading}
                          className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                        >
                          Initialize Protocol
                        </button>
                      </div>
                   </div>
                </div>

                {/* Human Details: Recent Activity */}
                <div className="bg-[#0A0A0C] p-12 rounded-[4rem] border border-white/5">
                   <div className="flex items-center gap-4 mb-10">
                      <div className="p-3 bg-white/5 rounded-2xl text-slate-400">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-white uppercase tracking-widest text-xs">Deployment Log</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Recent platform interactions</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      {logs.map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-2xl border border-white/2">
                           <div className="flex items-center gap-4">
                              <div className={`w-2 h-2 rounded-full ${log.status === "Error" ? "bg-rose-500" : "bg-emerald-500"}`} />
                              <span className="text-xs font-bold text-slate-300">{log.action}</span>
                           </div>
                           <div className="flex items-center gap-8">
                              <span className="text-[10px] font-mono text-slate-600">{log.time}</span>
                              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{log.status}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {isUploading && (
                  <div className="p-12 bg-[#0A0A0C] border border-violet-500/30 rounded-[3rem] shadow-2xl shadow-violet-900/20 flex flex-col gap-8 relative overflow-hidden">
                    <motion.div 
                      initial={{ left: '-100%' }} animate={{ left: '100%' }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                        <div>
                          <h4 className="text-xl font-black text-white tracking-widest uppercase">Deploying to Core</h4>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Synchronizing filesystems across cluster nodes</p>
                        </div>
                      </div>
                      <span className="text-2xl font-mono text-violet-500 animate-pulse">DEPLOYING...</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "edit" && (
              <motion.div 
                key="edit"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                className="h-full flex flex-col"
              >
                {selectedFile ? (
                  <div className="h-full bg-black rounded-[4rem] overflow-hidden shadow-2xl border border-white/5 flex flex-col">
                    <div className="px-16 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02] backdrop-blur-md">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white/5 rounded-[1.4rem] border border-white/10 flex items-center justify-center text-white">
                          <Terminal className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="font-black text-white text-lg tracking-tight uppercase">{selectedFile.split('/').pop()}</span>
                          <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                             {t.kernelBuffer} :: {selectedFile}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="flex -space-x-2">
                            {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-neutral-900 border-2 border-black flex items-center justify-center text-[10px] font-black text-slate-600">?</div>)}
                         </div>
                         <div className="w-px h-8 bg-white/5" />
                         <div className="flex gap-3">
                            {[1,2,3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-violet-600 opacity-20" />)}
                         </div>
                      </div>
                    </div>
                    <div className="flex-1 relative bg-[#050505]">
                      <div className="absolute top-0 left-0 bottom-0 w-16 bg-white/[0.01] border-r border-white/5 flex flex-col items-center py-10 text-[10px] font-mono text-slate-700 gap-4">
                         {Array.from({length: 20}).map((_, i) => <div key={i}>{(i + 1).toString().padStart(2, '0')}</div>)}
                      </div>
                      <textarea 
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        className="w-full h-full pl-24 pr-20 py-10 font-mono text-sm leading-loose resize-none focus:outline-none border-none bg-transparent text-slate-400 selection:bg-violet-600/30 custom-scrollbar overflow-y-auto"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-800 rounded-[5rem] border-[4px] border-dashed border-white/5">
                    <Terminal className="w-40 h-40 mb-10 opacity-5" />
                    <p className="font-black tracking-[0.6em] text-[10px] uppercase text-slate-700">{t.awaitingNode}</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "plans" && (
              <motion.div 
                key="plans"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                className="max-w-7xl mx-auto space-y-12 pb-24"
              >
                <div className="text-center mb-20">
                   <h2 className="text-6xl font-black text-white tracking-widest uppercase mb-4">{t.computePrecision}</h2>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em]">{t.selectEfficiency}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                   {Object.entries(plans).map(([id, plan]: [string, any]) => (
                     <div 
                      key={id}
                      className={`relative p-12 rounded-[4rem] border transition-all ${
                        user?.plan === id 
                        ? 'bg-violet-600/10 border-violet-500 shadow-2xl shadow-violet-900/20' 
                        : 'bg-[#0A0A0C] border-white/5 hover:border-white/10 shadow-sm'
                      }`}
                     >
                        {user?.plan === id && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-violet-600 text-[10px] font-black text-white rounded-full uppercase tracking-widest">
                             {t.activeCore}
                          </div>
                        )}
                        
                        <div className="flex flex-col h-full">
                           <div className="mb-10">
                              <h3 className="text-2xl font-black text-white tracking-tighter mb-2">{plan.name}</h3>
                              <p className="text-4xl font-mono text-white tracking-tighter">${plan.price}<span className="text-sm text-slate-600 lowercase">/mo</span></p>
                           </div>

                           <div className="space-y-6 mb-12 flex-1">
                              {[
                                { label: t.fileBuffer, value: plan.fileLimit === Infinity ? t.unlimited : `${plan.fileLimit} ${t.total}` },
                                { label: t.rootStruct, value: plan.folderLimit === Infinity ? t.unlimited : `${plan.folderLimit} Max` },
                                { label: t.branding, value: plan.watermark ? t.watermark : t.noWatermark },
                                { label: "Uptime SLA", value: plan.price > 0 ? "99.9% Logic" : "Dynamic" }
                              ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.label}</span>
                                  <span className="text-[10px] font-bold text-slate-300 uppercase">{item.value}</span>
                                </div>
                              ))}
                           </div>

                           <button 
                            onClick={() => upgradePlan(id)}
                            disabled={user?.plan === id}
                            className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${
                              user?.plan === id
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default'
                              : 'bg-white text-black hover:bg-violet-600 hover:text-white'
                            }`}
                           >
                             {user?.plan === id ? t.activeCore : t.upgradeTier}
                           </button>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="p-12 bg-white/5 rounded-[3rem] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-8">
                     <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600">
                        <Shield className="w-8 h-8" />
                     </div>
                     <div>
                        <h4 className="font-black text-white text-lg tracking-tight">Enterprise Infrastructure</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Contact for custom cluster configurations</p>
                     </div>
                  </div>
                  <button className="px-10 py-5 bg-white/5 hover:bg-white/10 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all">
                    Initialize Negotiation
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "preview" && (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="h-full w-full bg-[#050505] rounded-[5rem] shadow-2xl border border-white/5 overflow-hidden relative group flex flex-col"
              >
                <div className="h-16 border-b border-white/5 bg-[#0A0A0C] px-10 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                         <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20" />
                         <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                         <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                      </div>
                      <div className="w-px h-4 bg-white/5 mx-2" />
                      <div className="bg-white/5 px-4 py-1.5 rounded-lg border border-white/5 flex items-center gap-3">
                         <Globe className="w-3 h-3 text-slate-500" />
                         <select 
                           value={previewDomain}
                           onChange={(e) => {
                             setPreviewDomain(e.target.value);
                             addLog(`Routed to ${e.target.value}`, "Active");
                           }}
                           className="bg-transparent border-none focus:outline-none text-[10px] font-mono text-slate-400 appearance-none pr-4"
                         >
                            <option value="preview.cloudzero.network" className="bg-[#0A0A0C]">preview.cloudzero.network</option>
                            {myDomains.filter(d => d.linked).map(d => (
                              <option key={d.name} value={d.name} className="bg-[#0A0A0C]">{d.name}</option>
                            ))}
                         </select>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <button 
                        onClick={() => { if (previewFrameRef.current) previewFrameRef.current.src = previewFrameRef.current.src; }}
                        className="p-2 text-slate-600 hover:text-white transition-colors"
                      >
                         <RefreshCw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => window.open('/hosted', '_blank')}
                        className="p-2 text-slate-600 hover:text-white transition-colors"
                      >
                         <ExternalLink className="w-4 h-4" />
                      </button>
                   </div>
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 z-10" />
                  <iframe 
                    ref={previewFrameRef}
                    src="/hosted" 
                    className="w-full h-full border-none invert-0"
                    title="CloudZero Sandbox Preview"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Technical Footer */}
        <footer className="h-12 px-16 border-t border-white/5 bg-[#020203] flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-700">
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                 <span>{language === 'ka' ? 'პროტოკოლი' : 'Protocol'} :: JSON-RPC</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                 <span>{language === 'ka' ? 'კლასტერი' : 'Cluster'} :: 0.1 Stable</span>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <span className="opacity-40 italic font-medium lowercase tracking-normal">{t.note}</span>
              <div className="h-4 w-px bg-white/5" />
              <span className="text-slate-500">{t.nodeReady}</span>
           </div>
        </footer>

        {/* Manage Domain Modal */}
        <AnimatePresence>
          {isManageDomainOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-3xl"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-lg bg-[#0A0A0C] border border-white/10 rounded-[3rem] p-12 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{t.configuration}</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{t.domainLabel} :: {managingDomain}</p>
                  </div>
                  <button onClick={() => setIsManageDomainOpen(false)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-4">{t.clusterMapping}</label>
                     <div className="flex items-center gap-4">
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-slate-400">
                          {managingDomain} <span className="text-violet-500 mx-2">→</span> /root
                        </div>
                        <Check className="text-emerald-500 w-5 h-5" />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.security}</p>
                       <p className="text-xs font-bold text-emerald-500">SSL_ACTIVE</p>
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.protocolLabel}</p>
                       <p className="text-xs font-bold text-white uppercase tracking-widest">HTTP/3</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                        setIsManageDomainOpen(false);
                        setMessage({ type: "success", text: t.propagationInit });
                        addLog(`Updated config for ${managingDomain}`, "Stable");
                    }}
                    className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-violet-600 hover:text-white transition-all shadow-2xl"
                  >
                    {t.updateProp}
                  </button>

                  <button className="w-full py-5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all">
                    {t.detachDomain}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unified Notification UI */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className={`fixed bottom-12 right-12 px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-6 z-50 border backdrop-blur-3xl ${
                message.type === "success" ? "bg-black/80 border-emerald-500/20 text-emerald-400" : "bg-black/80 border-rose-500/20 text-rose-400"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
              <span className="text-xs font-black uppercase tracking-widest">{message.text}</span>
              <button onClick={() => setMessage(null)} className="ml-6 text-slate-500 hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Global Modals */}
        <AnimatePresence>
          {isAuthOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsAuthOpen(false)} />
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-[#0A0A0C] border border-white/10 rounded-[3rem] p-12 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                <h3 className="text-3xl font-black text-white tracking-tighter mb-2">{authMode === "login" ? t.kernelLogin : t.nodeSignup}</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Access the CodeZero Backbone</p>
                
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{t.identityLabel}</label>
                      <input 
                        type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                        placeholder="email@provider.com"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-violet-500/50 transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{t.secretKey}</label>
                      <input 
                        type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-violet-500/50 transition-all"
                      />
                   </div>
                   <button 
                    onClick={handleAuth}
                    className="w-full py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all shadow-xl shadow-white/5"
                   >
                     {authMode === "login" ? t.authenticate : t.createAccount}
                   </button>
                   <p className="text-center text-[10px] font-bold text-slate-600">
                     {authMode === "login" ? t.needNode : t.alreadyIdentity}
                     <button 
                      onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                      className="ml-2 text-violet-500 hover:underline"
                     >
                        {t.toggleMode}
                     </button>
                   </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {isCartOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-end p-6"
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
              <motion.div 
                initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
                className="relative w-full max-w-lg h-full bg-[#0A0A0C] border-l border-white/10 shadow-2xl flex flex-col"
              >
                <div className="p-12 border-b border-white/5 flex items-center justify-between">
                   <div>
                      <h3 className="text-2xl font-black text-white tracking-tighter">{t.pipeline}</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{t.stagedAssets}</p>
                   </div>
                   <button onClick={() => setIsCartOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                      <X className="w-5 h-5 text-slate-400" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 space-y-6">
                   {cart.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                        <ShoppingCart className="w-20 h-20 mb-6" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">{t.emptyPipeline}</p>
                     </div>
                   ) : (
                     cart.map((item) => (
                       <div key={item.id} className="p-8 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group">
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-violet-500 transition-colors">
                                <Globe className="w-5 h-5" />
                             </div>
                             <div>
                                <h4 className="font-black text-white">{item.name}</h4>
                                <p className="text-[10px] font-mono text-slate-600 mt-1">{item.priceStr}</p>
                             </div>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-3 text-slate-600 hover:text-rose-500 transition-all"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                     ))
                   )}
                </div>

                {cart.length > 0 && (
                  <div className="p-12 border-t border-white/5 bg-white/[0.02]">
                     <div className="flex items-center justify-between mb-10">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.totalInvestment}</span>
                        <span className="text-2xl font-black text-white tracking-tighter">
                          ${cart.reduce((s, i) => s + i.price, 0).toLocaleString()}
                        </span>
                     </div>
                     <button 
                      onClick={checkout}
                      disabled={isCheckingOut}
                      className="w-full py-6 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all shadow-xl disabled:opacity-20 flex items-center justify-center gap-4"
                     >
                       {isCheckingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                       {t.finalizeAcq}
                     </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}


