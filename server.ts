import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import AdmZip from "adm-zip";
import fs from "fs";
import os from "os";
import * as esbuild from "esbuild";
import simpleGit from "simple-git";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const HOSTED_DIR = path.join(process.cwd(), "hosted_content");

  // Global Middleware
  app.use(express.json({ limit: "150mb" }));
  app.use(express.urlencoded({ extended: true, limit: "150mb" }));

  // Ensure hosted_content directory exists
  if (!fs.existsSync(HOSTED_DIR)) {
    fs.mkdirSync(HOSTED_DIR, { recursive: true });
  }
  const defaultFile = path.join(HOSTED_DIR, "index.html");
  if (!fs.existsSync(defaultFile)) {
    fs.writeFileSync(defaultFile, `
      <html>
        <head>
          <title>CloudZero :: Environment Ready</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
            body { 
              background: #020203; 
              color: #fff; 
              font-family: 'Inter', system-ui, sans-serif; 
              display: flex; 
              flex-direction: column;
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0;
              overflow: hidden;
            }
            .grid {
              position: absolute;
              inset: 0;
              background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
              background-size: 40px 40px;
              z-index: 1;
            }
            .glow {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 600px;
              height: 600px;
              background: radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%);
              transform: translate(-50%, -50%);
              z-index: 2;
            }
            .content {
              text-align: center;
              position: relative;
              z-index: 10;
              padding: 4rem;
            }
            h1 {
              font-size: 5rem;
              font-weight: 900;
              letter-spacing: -0.06em;
              margin: 0;
              text-transform: uppercase;
              background: linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.2));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              line-height: 0.9;
            }
            .subtitle {
              color: #94a3b8;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.6em;
              font-size: 0.75rem;
              margin-top: 2rem;
              opacity: 0.6;
            }
            .badge {
              display: inline-flex;
              align-items: center;
              gap: 0.75rem;
              margin-top: 4rem;
              padding: 0.75rem 1.5rem;
              background: rgba(255,255,255,0.03);
              border: 1px solid rgba(255,255,255,0.08);
              border-radius: 100px;
              backdrop-blur: 10px;
            }
            .status-dot {
              width: 6px;
              height: 6px;
              background: #10b981;
              border-radius: 50%;
              box-shadow: 0 0 15px #10b981;
            }
            .status-text {
              font-size: 11px;
              font-weight: 900;
              letter-spacing: 0.2em;
              color: #10b981;
              text-transform: uppercase;
            }
            .footer {
              position: absolute;
              bottom: 4rem;
              font-family: 'JetBrains Mono', monospace;
              font-size: 10px;
              color: #334155;
              letter-spacing: 0.3em;
              text-transform: uppercase;
              z-index: 10;
            }
          </style>
        </head>
        <body>
          <div class="grid"></div>
          <div class="glow"></div>
          <div class="content">
            <h1>Deploy <br/> something <br/> beautiful.</h1>
            <p class="subtitle">CloudZero environment is active</p>
            <div class="badge">
              <div class="status-dot"></div>
              <span class="status-text">Production Ready</span>
            </div>
          </div>
          <div class="footer">Waiting for deployment buffer</div>
        </body>
      </html>
    `.trim());
  }

  // Multer setup for zip uploads - Use a local uploads directory to avoid cross-device issues
  const uploadTmpDir = path.join(process.cwd(), "uploads_tmp");
  if (!fs.existsSync(uploadTmpDir)) fs.mkdirSync(uploadTmpDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadTmpDir);
    },
    filename: (req, file, cb) => {
      cb(null, "upload-" + Date.now() + ".zip");
    },
  });
  const upload = multer({ 
    storage,
    limits: { fileSize: 150 * 1024 * 1024 } // 150MB limit
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // --- Domain & Commerce API ---
  const hostingPlans = {
    free: { name: "Quantum Free", price: 0, fileLimit: 100, folderLimit: 20, watermark: true },
    pro: { name: "Hyper Pro", price: 49, fileLimit: 5000, folderLimit: 500, watermark: false },
    enterprise: { name: "Nebula Enterprise", price: 299, fileLimit: Infinity, folderLimit: Infinity, watermark: false }
  };

  const domainInventory = [
    { id: "d1", name: "metaverse.com", price: 12400, premium: true },
    { id: "d2", name: "cloud.zero", price: 899, premium: true },
    { id: "d3", name: "future.tech", price: 2500, premium: true },
    { id: "d4", name: "nexus.io", price: 450, premium: false },
    { id: "d5", name: "pulse.dev", price: 120, premium: false },
    { id: "d6", name: "orbit.space", price: 35, premium: false }
  ];

  let userDomains = [
    { name: "cloudzero.network", status: "active", expiry: "2027-05-17", linked: true },
    { name: "engine.io", status: "processing", expiry: "2026-11-22", linked: false }
  ];

  let cart: any[] = [];
  let users: any[] = [
    { email: "datosandro951@gmail.com", password: "password", balance: 1000000, plan: "enterprise" }
  ];
  let currentUser: any = null;
  let domainToSiteMapping: Record<string, string> = { "cloudzero.network": "/" };

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    console.log(`[AUTH] Login attempt: ${email}`);
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      currentUser = user;
      console.log(`[AUTH] Login success: ${email}`);
      res.json({ success: true, user: { email: user.email, balance: user.balance, plan: user.plan } });
    } else {
      console.warn(`[AUTH] Login failed: ${email}`);
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/signup", (req, res) => {
    const { email, password } = req.body;
    console.log(`[AUTH] Signup attempt: ${email}`);
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    if (users.find(u => u.email === email)) {
      console.warn(`[AUTH] Signup failed - exists: ${email}`);
      return res.status(400).json({ error: "Identity exists. Use login module." });
    }
    const newUser = { email, password, balance: 100000, plan: "free" }; // Increased initial capital
    users.push(newUser);
    currentUser = newUser;
    console.log(`[AUTH] Signup success: ${email}`);
    res.json({ success: true, user: { email, balance: 100000, plan: "free" } });
  });

  app.get("/api/auth/me", (req, res) => {
    if (currentUser) res.json({ user: { email: currentUser.email, balance: currentUser.balance, plan: currentUser.plan } });
    else res.status(401).json({ error: "Not logged in" });
  });

  app.post("/api/auth/upgrade", (req, res) => {
    if (!currentUser) return res.status(401).json({ error: "Login required" });
    const { planId } = req.body;
    const plan = hostingPlans[planId as keyof typeof hostingPlans];
    if (!plan) return res.status(400).json({ error: "Invalid plan" });
    if (currentUser.balance < plan.price) return res.status(400).json({ error: "Insufficient balance" });
    
    currentUser.balance -= plan.price;
    currentUser.plan = planId;
    res.json({ success: true, plan: currentUser.plan, balance: currentUser.balance });
  });

  app.get("/api/domains/search", (req, res) => {
    const query = (req.query.q as string || "").toLowerCase();
    const results = domainInventory.filter(d => d.name.includes(query)).map(d => ({ ...d, priceStr: `$${d.price.toLocaleString()}` }));
    
    if (query && results.length < 3) {
      const tlds = [".com", ".net", ".io", ".dev", ".ai", ".sh"];
      tlds.forEach(tld => {
        if (!results.find(r => r.name === query + tld)) {
          const price = Math.floor(Math.random() * 50) + 12;
          results.push({
            id: `gen-${query}-${tld}`,
            name: query + tld,
            price: price,
            priceStr: `$${price}`,
            premium: Math.random() > 0.8
          });
        }
      });
    }
    res.json(results);
  });

  app.get("/api/cart", (req, res) => res.json(cart));
  app.post("/api/cart/add", (req, res) => {
    cart.push(req.body);
    res.json({ success: true, count: cart.length });
  });
  app.post("/api/cart/remove", (req, res) => {
    cart = cart.filter(item => item.id !== req.body.id);
    res.json({ success: true });
  });

  app.post("/api/checkout", (req, res) => {
    if (!currentUser) return res.status(401).json({ error: "Login required" });
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (currentUser.balance < total) return res.status(400).json({ error: "Insufficient balance" });
    
    currentUser.balance -= total;
    cart.forEach(item => {
      userDomains.push({
        name: item.name,
        status: "active",
        expiry: new Date(Date.now() + 31536000000).toISOString().split('T')[0],
        linked: true // Auto-link enabled
      });
      // Set the mapping automatically
      domainToSiteMapping[item.name] = "/";
    });
    cart = [];
    res.json({ success: true, balance: currentUser.balance });
  });

  app.get("/api/domains/my", (req, res) => {
    res.json(userDomains);
  });

  app.post("/api/domains/link", (req, res) => {
    const { domain, path: sitePath } = req.body;
    domainToSiteMapping[domain] = sitePath || "/";
    const d = userDomains.find(u => u.name === domain);
    if (d) d.linked = true;
    res.json({ success: true });
  });

  app.post("/api/import/github", async (req, res) => {
    if (!currentUser) return res.status(401).json({ error: "Identity required." });
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).json({ error: "Repository URL required." });

    console.log(`[GIT] Import request: ${repoUrl} from ${currentUser.email}`);

    const importDir = path.join(process.cwd(), `git_import_${Date.now()}`);
    
    try {
      const git = simpleGit();
      await git.clone(repoUrl, importDir, ["--depth", "1"]);

      // Verify limits
      const counts = countItems(importDir);
      const userPlan = currentUser.plan || "free";
      const planMeta = hostingPlans[userPlan as keyof typeof hostingPlans];

      if (counts.files > planMeta.fileLimit) {
        fs.rmSync(importDir, { recursive: true, force: true });
        return res.status(403).json({ error: `PROJECT_TOO_LARGE: Plan limit is ${planMeta.fileLimit} nodes.` });
      }

      // Safe deployment
      if (fs.existsSync(HOSTED_DIR)) {
        const items = fs.readdirSync(HOSTED_DIR);
        items.forEach(item => fs.rmSync(path.join(HOSTED_DIR, item), { recursive: true, force: true }));
      } else {
        fs.mkdirSync(HOSTED_DIR, { recursive: true });
      }

      // Move contents (excluding .git)
      const extracted = fs.readdirSync(importDir).filter(f => f !== ".git");
      for (const item of extracted) {
        fs.renameSync(path.join(importDir, item), path.join(HOSTED_DIR, item));
      }

      // Cleanup
      fs.rmSync(importDir, { recursive: true, force: true });

      // Structure Promotion
      promoteFolder(HOSTED_DIR);
      
      console.log(`[GIT] Import successful for ${currentUser.email}`);
      res.json({ status: "IMPORTED", files: fs.readdirSync(HOSTED_DIR).length });
    } catch (err: any) {
      console.error(`[GIT] Import failure:`, err);
      if (fs.existsSync(importDir)) fs.rmSync(importDir, { recursive: true, force: true });
      res.status(500).json({ error: "GIT_CLONE_FAULT: " + err.message });
    }
  });
  // --- End Domain & Commerce API ---

  // Recursive file listing helper
  function getFileTree(dir: string, baseDir: string): any[] {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    return items.map((item) => {
      const fullPath = path.join(dir, item.name);
      const relativePath = path.relative(baseDir, fullPath);
      return {
        name: item.name,
        path: relativePath,
        isDirectory: item.isDirectory(),
        children: item.isDirectory() ? getFileTree(fullPath, baseDir) : undefined,
      };
    });
  }

  app.get("/api/hosted/files", (req, res) => {
    if (!fs.existsSync(HOSTED_DIR)) return res.json([]);
    try {
      const tree = getFileTree(HOSTED_DIR, HOSTED_DIR);
      res.json(tree);
    } catch (error) {
      res.status(500).json({ error: "Failed to read file tree" });
    }
  });

  app.get("/api/hosted/read", (req, res) => {
    const filePath = req.query.path as string;
    if (!filePath) return res.status(400).json({ error: "Path is required" });
    
    const safePath = path.join(HOSTED_DIR, filePath);
    if (!safePath.startsWith(HOSTED_DIR)) return res.status(403).json({ error: "Access denied" });

    try {
      const content = fs.readFileSync(safePath, "utf-8");
      res.json({ content });
    } catch (error) {
      res.status(500).json({ error: "Failed to read file" });
    }
  });

  app.post("/api/hosted/write", (req, res) => {
    const { path: filePath, content } = req.body;
    if (!filePath) return res.status(400).json({ error: "Path is required" });

    const safePath = path.join(HOSTED_DIR, filePath);
    if (!safePath.startsWith(HOSTED_DIR)) return res.status(403).json({ error: "Access denied" });

    try {
      fs.writeFileSync(safePath, content, "utf-8");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to write file" });
    }
  });

  app.post("/api/hosted/create", (req, res) => {
    const { path: filePath, isDirectory } = req.body;
    const safePath = path.join(HOSTED_DIR, filePath);
    if (!safePath.startsWith(HOSTED_DIR)) return res.status(403).json({ error: "Access denied" });

    const counts = countItems(HOSTED_DIR);
    const userPlan = currentUser?.plan || "free";
    const planMeta = hostingPlans[userPlan as keyof typeof hostingPlans];

    if (isDirectory && counts.folders >= planMeta.folderLimit) {
      return res.status(403).json({ error: `Folder limit exceeded for ${planMeta.name} plan.` });
    }
    if (!isDirectory && counts.files >= planMeta.fileLimit) {
      return res.status(403).json({ error: `File limit exceeded for ${planMeta.name} plan.` });
    }

    try {
      if (isDirectory) {
        fs.mkdirSync(safePath, { recursive: true });
      } else {
        const dir = path.dirname(safePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(safePath, "");
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Creation failed" });
    }
  });

  app.post("/api/hosted/delete", (req, res) => {
    const { path: filePath } = req.body;
    const safePath = path.join(HOSTED_DIR, filePath);
    if (!safePath.startsWith(HOSTED_DIR)) return res.status(403).json({ error: "Access denied" });

    try {
      fs.rmSync(safePath, { recursive: true, force: true });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Deletion failed" });
    }
  });

  app.post("/api/hosted/rename", (req, res) => {
    const { oldPath, newPath } = req.body;
    const safeOldPath = path.join(HOSTED_DIR, oldPath);
    const safeNewPath = path.join(HOSTED_DIR, newPath);
    
    if (!safeOldPath.startsWith(HOSTED_DIR) || !safeNewPath.startsWith(HOSTED_DIR)) {
      return res.status(403).json({ error: "Access denied" });
    }

    try {
      fs.renameSync(safeOldPath, safeNewPath);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Rename failed" });
    }
  });

  // Proxy to get information about hosted files (Legacy support)
  app.get("/api/hosted-info", (req, res) => {
    if (!fs.existsSync(HOSTED_DIR)) {
      return res.json({ files: [] });
    }
    const files = fs.readdirSync(HOSTED_DIR);
    res.json({ files });
  });

  // Clear hosted content
  app.post("/api/clear", (req, res) => {
    if (fs.existsSync(HOSTED_DIR)) {
      fs.rmSync(HOSTED_DIR, { recursive: true, force: true });
      fs.mkdirSync(HOSTED_DIR);
    }
    res.json({ message: "Cleared successfully" });
  });

  // Helper to find the index.html or the most relevant root folder
  function findHostedRoot(dir: string): string {
    const items = fs.readdirSync(dir);
    if (items.includes("index.html")) return dir;
    
    // If only one directory, recurse
    const dirs = items.filter(i => fs.statSync(path.join(dir, i)).isDirectory());
    if (dirs.length === 1 && items.length === 1) {
      return findHostedRoot(path.join(dir, dirs[0]));
    }
    
    return dir;
  }

  function countItems(dir: string): { files: number, folders: number } {
    let files = 0;
    let folders = 0;
    if (!fs.existsSync(dir)) return { files, folders };
    const items = fs.readdirSync(dir, { withFileTypes: true });
    items.forEach(item => {
      if (item.isDirectory()) {
        folders++;
        const sub = countItems(path.join(dir, item.name));
        files += sub.files;
        folders += sub.folders;
      } else {
        files++;
      }
    });
    return { files, folders };
  }

  // Update promotion to be more recursive
  function promoteFolder(targetDir: string) {
    if (!fs.existsSync(targetDir)) return;
    const items = fs.readdirSync(targetDir).filter(item => item !== "__MACOSX" && !item.startsWith("."));

    if (items.length === 1) {
      const singlePath = path.join(targetDir, items[0]);
      if (fs.statSync(singlePath).isDirectory()) {
        console.log(`[DEPLOY] Removing wrapper layer: ${items[0]}`);
        const contents = fs.readdirSync(singlePath);
        for (const content of contents) {
          const oldPath = path.join(singlePath, content);
          const newPath = path.join(targetDir, content);
          if (fs.existsSync(newPath)) {
            fs.rmSync(newPath, { recursive: true, force: true });
          }
          fs.renameSync(oldPath, newPath);
        }
        fs.rmdirSync(singlePath);
        promoteFolder(targetDir); // Recursive check
      }
    }

    // After promotion, check if index.html exists and fix its paths
    const indexPath = path.join(targetDir, "index.html");
    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, "utf8");
      
      // Inject <base> tag if not present
      if (!content.includes("<base")) {
        content = content.replace("<head>", "<head>\n    <base href=\"/hosted/\">");
      }

      // Robust path rewriting for absolute paths that should stay within /hosted/
      // Matches src="/path", href="/path", etc. and replaces with src="./path"
      content = content.replace(/(src|href|content|action)\s*=\s*["']\/([^"']+)["']/g, (match, attr, path) => {
        // Skip paths that are obviously not internal (like http, //, etc)
        if (path.startsWith("http") || path.startsWith("//")) return match;
        // Skip our own /hosted/ paths if they were somehow absolute
        if (path.startsWith("hosted/")) return match;
        
        return `${attr}="./${path}"`;
      });

      // Also rewrite CSS urls that might be absolute
      content = content.replace(/url\(["']?\/([^"'\)]+)["']?\)/g, (match, path) => {
        if (path.startsWith("http") || path.startsWith("//") || path.startsWith("hosted/")) return match;
        return `url("./${path}")`;
      });

      // Watermark Logic
      const userPlan = currentUser?.plan || "free";
      const planMeta = hostingPlans[userPlan as keyof typeof hostingPlans];
      
      if (planMeta.watermark && !content.includes("cz-watermark")) {
        const waterMarkHtml = `
          <div id="cz-watermark" style="position:fixed;bottom:24px;right:24px;background:rgba(255,255,255,0.9);backdrop-filter:blur(10px);color:#111;padding:12px 24px;border-radius:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-weight:900;font-size:12px;box-shadow:0 20px 40px rgba(0,0,0,0.1);z-index:2147483647;border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;gap:12px;text-transform:uppercase;letter-spacing:1px;pointer-events:auto;user-select:none;">
            <div style="width:8px;height:8px;background:#8b5cf6;border-radius:2px;box-shadow:0 0 10px #8b5cf6;"></div>
            Deployed with CloudZero
          </div>
          <script>
            (function() {
              const w = document.getElementById('cz-watermark');
              if (!w) return;
              setInterval(() => {
                const style = window.getComputedStyle(w);
                if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) < 0.1) {
                  document.documentElement.innerHTML = '<div style="height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;background:#000;color:#fff;">Upgrade CloudZero Plan to remove watermark.</div>';
                }
              }, 2000);
            })();
          </script>
        `;
        content = content.replace("</body>", `${waterMarkHtml}\n</body>`);
      }
      
      fs.writeFileSync(indexPath, content);
    }
  }

  // Upload and Unzip logic
  app.post("/api/upload", upload.single("zipFile"), (req, res) => {
    console.log(`[ZIP] Deployment received: ${req.file?.originalname} (${req.file?.size} bytes)`);
    if (!req.file) return res.status(400).json({ error: "Missing archive payload" });

    try {
      const zip = new AdmZip(req.file.path);
      
      // Temporary extraction for verification
      const verifyDir = path.join(process.cwd(), `verify_${Date.now()}`);
      if (!fs.existsSync(verifyDir)) fs.mkdirSync(verifyDir, { recursive: true });
      zip.extractAllTo(verifyDir, true);
      
      const counts = countItems(verifyDir);
      const userPlan = currentUser?.plan || "free";
      const planMeta = hostingPlans[userPlan as keyof typeof hostingPlans];

      console.log(`[ZIP] User: ${currentUser?.email || "Guest"} Plan: ${userPlan} Stats: ${counts.files} files`);

      if (counts.files > planMeta.fileLimit || counts.folders > planMeta.folderLimit) {
        fs.rmSync(verifyDir, { recursive: true, force: true });
        fs.unlinkSync(req.file.path);
        return res.status(403).json({ 
          error: `ARCHIVE_REJECTED: Your ${planMeta.name} core is limited to ${planMeta.fileLimit} files. Please upgrade your efficiency tier.` 
        });
      }

      // Safe deployment to production directory
      if (fs.existsSync(HOSTED_DIR)) {
        const items = fs.readdirSync(HOSTED_DIR);
        items.forEach(item => fs.rmSync(path.join(HOSTED_DIR, item), { recursive: true, force: true }));
      } else {
        fs.mkdirSync(HOSTED_DIR, { recursive: true });
      }

      // Instead of re-extracting, we can move the verified files
      const extracted = fs.readdirSync(verifyDir);
      for (const item of extracted) {
        fs.renameSync(path.join(verifyDir, item), path.join(HOSTED_DIR, item));
      }

      // Cleanup
      fs.rmSync(verifyDir, { recursive: true, force: true });
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

      // Perform path optimization and structure promotion
      promoteFolder(HOSTED_DIR);
      
      const checkIndex = path.join(HOSTED_DIR, "index.html");
      if (!fs.existsSync(checkIndex)) {
        console.warn(`[ZIP] Runtime Caution: Project contains no index.html entry-node.`);
        const files = fs.readdirSync(HOSTED_DIR);
        const listHtml = `
          <html>
            <head><title>CloudZero Explorer</title><style>body{font-family:monospace;background:#030303;color:#0f0;padding:5rem;line-height:1.7;}a{color:#8b5cf6;text-decoration:none;}a:hover{text-decoration:underline;}li{margin-bottom:0.7rem;list-style:none;}</style></head>
            <body>
              <h1 style="color:#fff;border-bottom:1px solid #111;padding-bottom:1rem;">Cluster Protocol: Online</h1>
              <p style="color:#666">Deployment successfully indexed, but no <strong>index.html</strong> entry-point detected.</p>
              <ul style="padding:0">
                ${files.map(f => `<li><span style="color:#333">#</span> <a href="/hosted/${f}">${f}</a></li>`).join("")}
              </ul>
            </body>
          </html>
        `;
        fs.writeFileSync(checkIndex, listHtml);
      }

      res.json({ status: "SYNCHRONIZED", filesRemoved: true });
    } catch (error: any) {
      console.error(`[ZIP] Deployment Fault:`, error);
      res.status(500).json({ error: "DEPLOYMENT_FAULT: " + error.message });
    }
  });

  // Multer setup for multiple file uploads
  const multiStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Ensure HOSTED_DIR exists
      if (!fs.existsSync(HOSTED_DIR)) fs.mkdirSync(HOSTED_DIR, { recursive: true });
      cb(null, HOSTED_DIR);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  const uploadMulti = multer({ storage: multiStorage });

  // Multiple File Upload Endpoint
  app.post("/api/upload-files", uploadMulti.array("files"), (req, res) => {
    try {
      const counts = countItems(HOSTED_DIR);
      const userPlan = currentUser?.plan || "free";
      const planMeta = hostingPlans[userPlan as keyof typeof hostingPlans];

      if (counts.files > planMeta.fileLimit || counts.folders > planMeta.folderLimit) {
        // Just warning for now as files are already on disk via multer
      }

      // Check for promotion after multi-upload
      promoteFolder(HOSTED_DIR);

      res.json({ message: "FILES_UPLOADED", count: (req.files as any[]).length });
    } catch (error: any) {
      res.status(500).json({ error: "UPLOAD_FAILED: " + error.message });
    }
  });

  // Serve hosted static files - IMPORTANT: Must be before Vite/Production catch-all
  
  // Explicit MIME types for sanity
  const mimeTypes: Record<string, string> = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".txt": "text/plain",
    ".pdf": "application/pdf"
  };

  // Custom middleware to transpile TS/TSX/JSX on the fly
  app.use("/hosted", async (req, res, next) => {
    const ext = path.extname(req.path).toLowerCase();
    
    // Set content type if found in our map
    if (mimeTypes[ext]) {
        res.setHeader("Content-Type", mimeTypes[ext]);
    }

    if ([".tsx", ".ts", ".jsx"].includes(ext)) {
      const filePath = path.join(HOSTED_DIR, req.path);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, "utf8");
          const result = await esbuild.transform(content, {
            loader: ext.slice(1) as any,
            target: "esnext",
            format: "esm",
            jsx: "automatic",
          });
          res.setHeader("Content-Type", "application/javascript");
          return res.send(result.code);
        } catch (err) {
          console.error(`[COMPILER] Transpilation failed for ${req.path}:`, err);
          return res.status(500).send("Transpilation Error: " + (err as Error).message);
        }
      }
    }
    next();
  });

  // Regular static serving for other files
  app.use("/hosted", express.static(HOSTED_DIR, {
    fallthrough: true,
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (mimeTypes[ext]) {
        res.setHeader("Content-Type", mimeTypes[ext]);
      }
    }
  }));

  // SPA Fallback for /hosted route to prevent white screens on client-side routing
  // Use a catch-all but only for navigation requests that don't match a file
  app.get("/hosted/*", (req, res, next) => {
    // If it's looking for a file with an extension, don't fallback to index.html
    if (path.extname(req.path)) return next();
    
    const indexPath = path.join(HOSTED_DIR, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Protocol Error: No entry-node detected.");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Hosted content directory: ${HOSTED_DIR}`);
  });

  // Increase timeout for large uploads
  server.timeout = 300000; // 5 minutes
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
