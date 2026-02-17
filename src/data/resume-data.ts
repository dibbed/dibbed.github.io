export interface Profile {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  telegram: string;
  github: string;
  summary: string;
  availability: string;
  languages: { language: string; level: string }[];
}

export interface Skill {
  category: string;
  categoryFa: string;
  items: { name: string; level?: "Expert" | "Advanced" | "Proficient" }[];
}

export interface Achievement {
  label: string;
  value: string;
}

export interface Experience {
  title: string;
  titleFa?: string;
  company: string;
  role: string;
  roleFa?: string;
  period: string;
  bullets: string[];
  bulletsFa?: string[];
  tech: string[];
  metrics?: string[];
}

export interface ArchitectureData {
  mermaid: string;
  summary: string;
  summaryFa?: string;
}

export interface Project {
  name: string;
  description: string;
  descriptionFa?: string;
  tech: string[];
  architecture?: ArchitectureData;
}

export interface Education {
  degree: string;
  degreeFa?: string;
  institution: string;
  institutionFa?: string;
  period: string;
  focus?: string;
  focusFa?: string;
}

export const profile: Profile = {
  name: "ALI KHALILI",
  title: "Senior Python Backend Engineer",
  location: "Gorgan, Iran (Remote / Relocation)",
  phone: "+989912906380",
  email: "ali0.0kh1380@gmail.com",
  telegram: "t.me/dibbed",
  github: "github.com/dibbed",
  summary:
    "Result-oriented Senior Backend Engineer with 6.5+ years of experience architecting high-concurrency distributed systems, AI/ML pipelines, and scalable infrastructure. Expert in Python (FastAPI, AsyncIO, Flask), RAG systems, LLM integration, Telegram bot ecosystems, and real-time monitoring solutions. Proven track record delivering production systems achieving ~500-800 RPS, ~50-100ms response times, and 99.5%+ uptime serving 400K+ registered users.",
  availability: "Ready for immediate start (Full-time Remote or Relocation)",
  languages: [
    { language: "Persian", level: "Native" },
    { language: "English", level: "Professional Working Proficiency" },
  ],
};

export const achievements: Achievement[] = [
  { label: "Users Served", value: "400K+" },
  { label: "Requests/Second", value: "~500-800" },
  { label: "Avg Response", value: "~50-100ms" },
  { label: "System Uptime", value: "99.5%+" },
  { label: "Setup Reduction", value: "80%" },
  { label: "Production Systems", value: "18+" },
];

export const skills: Skill[] = [
  {
    category: "Languages",
    categoryFa: "زبان‌های برنامه‌نویسی",
    items: [
      { name: "Python", level: "Expert" },
      { name: "Bash", level: "Advanced" },
      { name: "JavaScript", level: "Proficient" },
      { name: "Lua", level: "Proficient" },
      { name: "SQL", level: "Advanced" },
    ],
  },
  {
    category: "Frameworks",
    categoryFa: "فریمورک‌ها",
    items: [
      { name: "FastAPI", level: "Expert" },
      { name: "Flask", level: "Advanced" },
      { name: "AsyncIO", level: "Expert" },
      { name: "Aiogram 3.x" },
      { name: "Pyrogram" },
      { name: "Telethon" },
      { name: "Pydantic v2" },
      { name: "SQLAlchemy 2.0" },
      { name: "Typer CLI" },
    ],
  },
  {
    category: "AI/ML & NLP",
    categoryFa: "هوش مصنوعی",
    items: [
      { name: "LangChain" },
      { name: "OpenAI API" },
      { name: "Hugging Face" },
      { name: "RAG Systems" },
      { name: "FAISS" },
      { name: "ChromaDB" },
      { name: "Qdrant" },
      { name: "Weaviate" },
      { name: "Sentence Transformers" },
      { name: "Edge TTS" },
    ],
  },
  {
    category: "Databases",
    categoryFa: "پایگاه داده",
    items: [
      { name: "Redis 7", level: "Expert" },
      { name: "PostgreSQL", level: "Advanced" },
      { name: "MongoDB 7", level: "Advanced" },
      { name: "MySQL" },
      { name: "SQLite" },
      { name: "Vector DBs" },
    ],
  },
  {
    category: "DevOps",
    categoryFa: "دوآپس",
    items: [
      { name: "Docker", level: "Advanced" },
      { name: "Kubernetes" },
      { name: "Nginx", level: "Advanced" },
      { name: "Prometheus" },
      { name: "Grafana" },
      { name: "Loki" },
      { name: "CI/CD" },
      { name: "Let's Encrypt" },
      { name: "Certbot" },
    ],
  },
  {
    category: "Security",
    categoryFa: "امنیت",
    items: [
      { name: "Argon2id" },
      { name: "JWT" },
      { name: "CSRF" },
      { name: "Rate Limiting" },
      { name: "RBAC" },
      { name: "SSL/TLS" },
      { name: "Audit Logging" },
      { name: "KYC Systems" },
    ],
  },
  {
    category: "Blockchain",
    categoryFa: "بلاکچین",
    items: [
      { name: "Tron Network" },
      { name: "TRX/USDT" },
      { name: "tronpy" },
      { name: "Non-custodial Wallets" },
      { name: "Payment Gateways" },
    ],
  },
  {
    category: "Scraping",
    categoryFa: "اسکرپینگ",
    items: [
      { name: "Selenium" },
      { name: "Playwright" },
      { name: "BeautifulSoup" },
      { name: "lxml" },
      { name: "Antibot-Bypass" },
    ],
  },
];

export const experiences: Experience[] = [
  {
    title: "Enterprise VPN Management Platform",
    titleFa: "پلتفرم مدیریت VPN سازمانی",
    company: "Namayandegi",
    role: "Senior Python Engineer & System Architect",
    roleFa: "مهندس ارشد پایتون و معمار سیستم",
    period: "March 2019 — Present",
    bullets: [
      "Engineered enterprise-grade multi-tenant VPN platform with automated provisioning for thousands of clients across multiple panels.",
      "Built metric collection pipelines using Redis multi-DB architecture for real-time traffic monitoring.",
      "Implemented multi-panel integration (X-UI, Marzban, S-UI, WireGuard-Go) with unified REST API interface.",
      "Designed multi-layer security with Argon2id (256MB memory cost), CSRF protection, distributed rate limiting, and RBAC.",
      "Built Flask-based subscription server with SingBox configuration generation and automatic SSL provisioning.",
    ],
    bulletsFa: [
      "طراحی پلتفرم VPN چند مستأجری سازمانی با تأمین خودکار برای هزاران کلاینت در چندین پنل.",
      "ساخت خطوط جمع‌آوری متریک با معماری چند دیتابیس Redis برای نظارت لحظه‌ای ترافیک.",
      "پیاده‌سازی یکپارچه‌سازی چند پنل (X-UI, Marzban, S-UI, WireGuard-Go) با رابط REST API واحد.",
      "طراحی امنیت چند لایه با Argon2id، محافظت CSRF، محدودیت نرخ توزیع‌شده و RBAC.",
      "ساخت سرور اشتراک Flask با تولید پیکربندی SingBox و تأمین خودکار SSL.",
    ],
    tech: ["FastAPI", "Python 3.11+", "Redis 7", "MongoDB 7", "Pyrogram", "Flask", "Nginx", "Docker", "Prometheus", "Grafana"],
    metrics: ["~50-100ms avg response", "~500-800 RPS", "99.5%+ uptime"],
  },
  {
    title: "Anonymous Messenger Platform",
    titleFa: "پلتفرم پیام‌رسان ناشناس",
    company: "400K+ Users",
    role: "Lead Backend Engineer",
    roleFa: "مهندس ارشد بک‌اند",
    period: "2021 — Present",
    bullets: [
      "Architected distributed messaging system serving over 400,000 registered users with low-latency message delivery.",
      "Implemented layered async architecture (Controllers-Services-Repositories) with dependency injection.",
      "Built comprehensive health check APIs, Prometheus metrics, structured JSON logging, and audit trails.",
      "Developed RBAC, configurable rate limiting, anti-abuse systems, media locks, and 6-language internationalization.",
    ],
    bulletsFa: [
      "معماری سیستم پیام‌رسانی توزیع‌شده با بیش از ۴۰۰ هزار کاربر ثبت‌نام‌شده و تحویل پیام با تأخیر کم.",
      "پیاده‌سازی معماری ناهمزمان لایه‌ای (کنترلرها-سرویس‌ها-ریپازیتوری‌ها) با تزریق وابستگی.",
      "ساخت APIهای بررسی سلامت، متریک‌های Prometheus، لاگ‌گذاری ساختاریافته JSON و دنباله‌های ممیزی.",
      "توسعه RBAC، محدودیت نرخ قابل تنظیم، سیستم‌های ضد سوءاستفاده و بین‌المللی‌سازی ۶ زبانه.",
    ],
    tech: ["Python 3.11+", "Aiogram 3.4", "FastAPI", "PostgreSQL 14+", "Redis 7+", "SQLAlchemy 2.0", "Nginx"],
    metrics: ["400K+ registered users", "Low-latency delivery"],
  },
  {
    title: "RAG Telegram Assistant",
    titleFa: "دستیار RAG تلگرام",
    company: "AI/ML Production System",
    role: "AI/ML Engineer",
    roleFa: "مهندس هوش مصنوعی",
    period: "2023 — Present",
    bullets: [
      "Built production-ready RAG system with multi-provider LLM support (OpenAI, Anthropic, Ollama, Hugging Face).",
      "Implemented 4 vector databases (FAISS, Chroma, Qdrant, Weaviate) with migration tools and performance benchmarking.",
      "Developed advanced chunking strategies (Token, Semantic, Hierarchical, Adaptive) with hybrid search and reranking.",
      "Built multi-format document processing (PDF, DOCX, URL, TXT) with OCR support and Persian/English language detection.",
    ],
    bulletsFa: [
      "ساخت سیستم RAG آماده تولید با پشتیبانی LLM چند ارائه‌دهنده (OpenAI, Anthropic, Ollama, Hugging Face).",
      "پیاده‌سازی ۴ پایگاه داده برداری (FAISS, Chroma, Qdrant, Weaviate) با ابزارهای مهاجرت و بنچمارک.",
      "توسعه استراتژی‌های تکه‌بندی پیشرفته (توکن، معنایی، سلسله‌مراتبی، تطبیقی) با جستجوی ترکیبی.",
      "ساخت پردازش اسناد چند فرمت (PDF, DOCX, URL, TXT) با پشتیبانی OCR و تشخیص زبان فارسی/انگلیسی.",
    ],
    tech: ["Python", "LangChain", "FastAPI", "FAISS", "Chroma", "Qdrant", "OpenAI API", "HuggingFace", "Redis", "Docker"],
    metrics: ["82% test coverage", "Multi-provider LLM support"],
  },
  {
    title: "Telegram Engagement Automation (SeenPanel)",
    titleFa: "اتوماسیون تعامل تلگرام (SeenPanel)",
    company: "SeenPanel",
    role: "Backend Engineer",
    roleFa: "مهندس بک‌اند",
    period: "2022 — 2024",
    bullets: [
      "Built high-performance distributed system for automating Telegram engagement operations with thousands of concurrent sessions.",
      "Implemented dynamic thread allocation (5-90 threads based on volume), intelligent rate limiting with FloodWait handling.",
      "Designed REST API for order management with multi-provider integration, auto-failover, and real-time statistics.",
      "Built session health monitoring with automatic quarantine, recovery mechanisms, and 1:1 proxy-session mapping.",
    ],
    bulletsFa: [
      "ساخت سیستم توزیع‌شده با عملکرد بالا برای اتوماسیون عملیات تعامل تلگرام با هزاران نشست همزمان.",
      "پیاده‌سازی تخصیص پویای رشته (۵ تا ۹۰ رشته)، محدودیت نرخ هوشمند با مدیریت FloodWait.",
      "طراحی REST API برای مدیریت سفارش با یکپارچه‌سازی چند ارائه‌دهنده و آمار لحظه‌ای.",
      "ساخت نظارت سلامت نشست با قرنطینه خودکار، مکانیزم‌های بازیابی و نگاشت ۱:۱ پروکسی-نشست.",
    ],
    tech: ["Python", "Telethon", "Pyrogram", "Redis", "Flask", "tmux", "Multi-threaded Architecture"],
    metrics: ["40+ emoji reactions supported", "Thousands of concurrent sessions"],
  },
  {
    title: "TronPY Cryptocurrency Payment Bot",
    titleFa: "ربات پرداخت رمزارز TronPY",
    company: "Blockchain Payment Gateway",
    role: "Full-Stack Engineer",
    roleFa: "مهندس فول‌استک",
    period: "2023 — 2024",
    bullets: [
      "Developed production-ready Telegram bot for automated TRON (TRX) cryptocurrency purchases with Iranian payment gateway (Zibal).",
      "Implemented multi-tier KYC verification system (Level 0/1/2) with phone validation and document verification.",
      "Built real-time TRX/IRR price scraping, automated blockchain transfers via tronpy, and secure wallet management.",
      "Designed Redis-backed state machine for conversation flow, Flask webhook server for payment callbacks.",
    ],
    bulletsFa: [
      "توسعه ربات تلگرام آماده تولید برای خرید خودکار رمزارز TRON با درگاه پرداخت زیبال.",
      "پیاده‌سازی سیستم تأیید هویت چند سطحی (سطح ۰/۱/۲) با اعتبارسنجی تلفن و مدارک.",
      "ساخت اسکرپینگ لحظه‌ای قیمت TRX/IRR، انتقال خودکار بلاکچین و مدیریت امن کیف پول.",
      "طراحی ماشین حالت Redis برای جریان مکالمه و سرور وب‌هوک Flask برای کال‌بک‌های پرداخت.",
    ],
    tech: ["Python", "pyTelegramBotAPI", "tronpy", "Flask", "Redis", "BeautifulSoup", "Zibal API"],
    metrics: ["Multi-tier KYC", "Automated blockchain transfers"],
  },
];

export const projects: Project[] = [
  {
    name: "Enterprise VPN Management Platform",
    description: "Enterprise-grade VPN management platform with FastAPI backend, Pyrogram Telegram bot, Flask subscription server, and multi-panel integration (X-UI, Marzban, S-UI, WireGuard). Features Argon2id auth, OCR payment verification, SingBox config generation, and real-time analytics. 84 API endpoints, 67 command handlers, 4200 RPS throughput.",
    descriptionFa: "پلتفرم مدیریت VPN سازمانی با بک‌اند FastAPI، ربات تلگرام Pyrogram، سرور اشتراک Flask و یکپارچه‌سازی چند پنل (X-UI، Marzban، S-UI، WireGuard). شامل احراز هویت Argon2id، تأیید پرداخت OCR، تولید پیکربندی SingBox و تحلیل لحظه‌ای. ۸۴ اندپوینت API، ۶۷ هندلر فرمان، ۴۲۰۰ درخواست در ثانیه.",
    tech: ["FastAPI", "Pyrogram", "Flask", "Redis", "MongoDB", "Docker", "Nginx", "X-UI", "Marzban", "Argon2id", "Google Vision OCR"],
    architecture: {
      mermaid: `flowchart TD
  UserTG[Telegram User] --> Bot[Pyrogram Bot]
  UserWeb[MiniApp User] --> Mini[Flask Mini-App]
  Client[VPN Client Apps] --> Sub[Flask Subscription API]
  Bot --> Redis[(Redis Multi-DB)]
  Mini --> Redis
  Sub --> Redis
  Bot --> Mongo[(MongoDB)]
  Mini --> Mongo
  Bot --> Panels[X-UI / Marzban / S-UI / WireGuard]
  Bot --> OCR[Google Vision OCR]
  Sub --> SingBox[SingBox Converter]
  Bot --> Admin[Admin Dashboard]`,
      summary: "Hybrid architecture: Pyrogram bot orchestration + Flask subscription server + Flask mini-app APIs. Redis multi-database for sessions/state/cache, MongoDB for analytics/audit. Adapter-pattern panel integration supports 4 VPN panel types and 7 protocols. 84 REST endpoints with Argon2id auth, distributed rate limiting, and OCR-based payment verification. 4200 RPS at 11ms P95.",
      summaryFa: "معماری ترکیبی: هماهنگ‌سازی ربات Pyrogram + سرور اشتراک Flask + APIهای مینی‌اپ Flask. Redis چند پایگاه‌داده برای نشست/حالت/کش، MongoDB برای تحلیل/ممیزی. یکپارچه‌سازی پنل با الگوی آداپتور از ۴ نوع پنل VPN و ۷ پروتکل پشتیبانی می‌کند. ۸۴ اندپوینت REST با احراز هویت Argon2id و تأیید پرداخت OCR. ۴۲۰۰ درخواست در ثانیه با P95 برابر ۱۱ میلی‌ثانیه.",
    },
  },
  {
    name: "TTSKit",
    description: "Multi-engine TTS toolkit with Google TTS, Microsoft Edge TTS, and Piper offline support. Features FastAPI server, CLI tools, Telegram bot, smart caching, and Persian language prioritization. 87% test coverage.",
    descriptionFa: "ابزار تبدیل متن به گفتار چندموتوره با پشتیبانی از Google TTS، Microsoft Edge TTS و Piper آفلاین. شامل سرور FastAPI، ابزارهای CLI، ربات تلگرام و کش هوشمند. ۸۷٪ پوشش تست.",
    tech: ["Python", "FastAPI", "Edge TTS", "Piper TTS", "Redis", "Docker", "SQLAlchemy", "Typer"],
    architecture: {
      mermaid: `graph LR
  A[🎤 Telegram Bot] --> R[EngineRouter]
  B[🌐 FastAPI] --> R
  C[💻 CLI/Typer] --> R
  D[📦 Library] --> R
  R --> E[gTTS]
  R --> F[Edge TTS]
  R --> G[Piper TTS]
  E --> H[Cache Layer]
  F --> H
  G --> H
  H --> I[File Storage]
  R --> J[Rate Limiter]
  R --> K[Pydantic Validator]`,
      summary: "Multi-input orchestration layer routes text through language-aware engine selection (gTTS/Edge/Piper), with Redis caching and rate limiting. Supports 4 Telegram frameworks.",
      summaryFa: "لایه هماهنگ‌سازی چند ورودی متن را از طریق انتخاب موتور آگاه از زبان هدایت می‌کند، با کش Redis و محدودیت نرخ.",
    },
  },
  {
    name: "Anonymous Messenger",
    description: "Enterprise-grade Telegram bot for anonymous messaging serving 400K+ users. Layered architecture with dependency injection, RBAC, 6-language i18n, custom links, and comprehensive admin panel.",
    descriptionFa: "ربات تلگرام سازمانی برای پیام‌رسانی ناشناس با بیش از ۴۰۰ هزار کاربر. معماری لایه‌ای با تزریق وابستگی، RBAC و پنل مدیریت جامع.",
    tech: ["Python 3.11+", "Aiogram 3.4", "FastAPI", "PostgreSQL", "Redis 7", "SQLAlchemy 2.0"],
    architecture: {
      mermaid: `graph TD
  A[👤 Telegram Users] --> B[Controllers / Routers]
  B --> C[Service Layer]
  C --> D[Repository Layer]
  D --> E[(PostgreSQL)]
  D --> F[(Redis Cache)]
  C --> G[DI Container]
  B --> H[FastAPI Health]
  H --> I[Prometheus Metrics]
  C --> J[Audit Logger]`,
      summary: "Layered async architecture (Controllers→Services→Repositories) with dependency injection. PostgreSQL for persistence, Redis for caching/sessions, Prometheus for observability.",
      summaryFa: "معماری لایه‌ای ناهمزمان با تزریق وابستگی. PostgreSQL برای ذخیره‌سازی، Redis برای کش و Prometheus برای مشاهده‌پذیری.",
    },
  },
  {
    name: "RAG Assistant",
    description: "Advanced RAG system with multi-provider LLM support, 4 vector databases, advanced chunking strategies, hybrid search, encryption, plugins, and multi-tenant support. 82% test coverage.",
    descriptionFa: "سیستم RAG پیشرفته با پشتیبانی از چند ارائه‌دهنده LLM، ۴ پایگاه داده برداری، جستجوی ترکیبی، رمزنگاری و پشتیبانی چند مستأجری. ۸۲٪ پوشش تست.",
    tech: ["Python", "LangChain", "FastAPI", "FAISS", "Chroma", "Qdrant", "Weaviate", "OpenAI", "Docker"],
    architecture: {
      mermaid: `graph LR
  A[📄 Documents] --> B[Loader]
  B --> C[Chunker]
  C --> D[Embedder]
  D --> E[(Vector Store)]
  F[❓ User Query] --> G[Query Engine]
  G --> E
  G --> H[Reranker]
  H --> I[LLM Provider]
  I --> J[📤 Response]
  E --> H`,
      summary: "Document processing pipeline (Load→Chunk→Embed→Store) feeds a retrieval engine with hybrid search, reranking, and multi-provider LLM generation. Supports FAISS, Chroma, Qdrant, Weaviate.",
      summaryFa: "خط پردازش اسناد یک موتور بازیابی با جستجوی ترکیبی و تولید LLM چند ارائه‌دهنده تغذیه می‌کند.",
    },
  },
  {
    name: "SeenPanel",
    description: "High-performance distributed system for Telegram engagement automation with dynamic thread allocation, intelligent rate limiting, session health monitoring, and multi-provider API integration.",
    descriptionFa: "سیستم توزیع‌شده با عملکرد بالا برای اتوماسیون تعامل تلگرام با تخصیص پویای رشته، محدودیت نرخ هوشمند و نظارت بر سلامت نشست.",
    tech: ["Python", "Telethon", "Pyrogram", "Redis", "Flask", "tmux", "Multi-threaded"],
    architecture: {
      mermaid: `graph TD
  A[🌐 REST API] --> B[(Redis Queue)]
  C[🤖 Bot Commands] --> B
  B --> D[tmux Workers]
  D --> E[Thread Pool]
  E --> F[Session Pool]
  F --> G[Telegram API]
  F --> H[Proxy Manager]
  E --> I[Health Monitor]
  I --> F`,
      summary: "Order-driven pipeline: API/Bot → Redis queue → tmux process isolation → dynamic thread pool (5-90 threads) → Telegram session pool with 1:1 proxy mapping and auto-recovery.",
      summaryFa: "خط لوله مبتنی بر سفارش: API → صف Redis → ایزوله‌سازی tmux → مجموعه رشته پویا → استخر نشست تلگرام با نگاشت پروکسی.",
    },
  },
  {
    name: "TronPY Bot",
    description: "Production-ready Telegram bot for automated TRON cryptocurrency purchases with Zibal payment gateway, multi-tier KYC, real-time price scraping, and Redis state machine.",
    descriptionFa: "ربات تلگرام آماده تولید برای خرید خودکار رمزارز TRON با درگاه پرداخت زیبال، KYC چند سطحی و اسکرپینگ قیمت لحظه‌ای.",
    tech: ["Python", "pyTelegramBotAPI", "tronpy", "Flask", "Redis", "BeautifulSoup", "Zibal API"],
    architecture: {
      mermaid: `graph TD
  A[👤 Users] --> B[Bot Handler]
  B --> C[(Redis State)]
  B --> D[KYC System]
  B --> E[Zibal Gateway]
  E --> F[Flask Callback]
  B --> G[TRON Network]
  G --> H[Wallet Transfer]
  B --> I[Price Scraper]
  F --> C`,
      summary: "Multi-threaded architecture: Bot polling + Flask webhook + background workers. Redis state machine manages conversation flow. Zibal handles IRR payments, tronpy handles blockchain transfers.",
      summaryFa: "معماری چند رشته‌ای: ربات + وب‌هوک Flask + وظایف پس‌زمینه. ماشین حالت Redis جریان مکالمه را مدیریت می‌کند.",
    },
  },
  {
    name: "Quote System",
    description: "Microservices-based quote management with 3 interconnected Telegram bots, AI-powered GPT-4 translation, gamification scoring system, and automated scheduled distribution.",
    descriptionFa: "سیستم مدیریت نقل‌قول مبتنی بر میکروسرویس با ۳ ربات تلگرام به‌هم‌پیوسته، ترجمه با GPT-4، سیستم امتیازدهی و توزیع خودکار.",
    tech: ["Python", "Pyrogram", "OpenAI GPT-4", "Redis", "JSON", "Scheduler"],
    architecture: {
      mermaid: `graph TD
  A[📝 Quote Sources] --> B[Moderator Bot]
  B --> C[OpenAI Translator]
  C --> D[(Redis Store)]
  D --> E[Messenger Bot]
  D --> F[Auto Sender]
  F --> G[📢 Channel]
  E --> H[Scoring System]
  H --> D`,
      summary: "Three-bot microservices: Moderator (admin review) → AI translation pipeline → Redis store ← Messenger (user submissions + gamification) + Auto Sender (scheduled channel posts).",
      summaryFa: "سه ربات میکروسرویس: مدیر (بررسی) → خط لوله ترجمه AI → ذخیره Redis ← پیام‌رسان (ارسال کاربر + گیمیفیکیشن) + ارسال خودکار.",
    },
  },
  {
    name: "NginxSSLAuto",
    description: "Automated SSL certificate management for Nginx using Let's Encrypt. CLI & Python API, multi-domain support, auto-renewal, and reverse proxy configuration.",
    descriptionFa: "مدیریت خودکار گواهی SSL برای Nginx با Let's Encrypt. رابط CLI و API پایتون، پشتیبانی چند دامنه و تنظیم پروکسی معکوس.",
    tech: ["Python", "Nginx", "Certbot", "Let's Encrypt", "OpenSSL", "CLI"],
    architecture: {
      mermaid: `graph TD
  A[💻 CLI] --> C[Core Engine]
  B[🐍 Python API] --> C
  C --> D[SSL Manager]
  C --> E[Nginx Configurator]
  D --> F[Certbot / Let's Encrypt]
  E --> G[Nginx Server]
  C --> H[OpenSSL]
  C --> I[.env Config]`,
      summary: "Three entry points (CLI, API, Runner) feed a central core engine that orchestrates SSL certificate acquisition via Certbot and Nginx site configuration management.",
      summaryFa: "سه نقطه ورود به یک موتور مرکزی تغذیه می‌شوند که دریافت گواهی SSL و مدیریت پیکربندی Nginx را هماهنگ می‌کند.",
    },
  },
  {
    name: "RespectBot",
    description: "Enterprise Telegram group management with 5-tier admin hierarchy, anti-betrayal detection, real-time event monitoring, dual-bot architecture, and Redis-backed distributed state.",
    descriptionFa: "مدیریت گروه تلگرام سازمانی با سلسله‌مراتب ۵ سطحی مدیر، تشخیص خیانت، نظارت لحظه‌ای رویدادها و معماری دو رباتی.",
    tech: ["Python", "Pyrogram MTProto", "Redis", "Observer Pattern"],
    architecture: {
      mermaid: `graph TD
  A[📱 Telegram Groups] --> B[Main Bot]
  A --> C[API Bot]
  B --> D[(Redis DB6)]
  C --> D
  D --> E[Monitor Threads]
  E --> F[Anti-Betrayal]
  E --> G[Event Logger]
  E --> H[Stats Tracker]
  F --> D`,
      summary: "Dual-bot system (commands + API) with thread-per-group monitoring. Redis DB6 for distributed state. Dedicated threads track admin actions, detect betrayal patterns, and enforce 5-tier permissions.",
      summaryFa: "سیستم دو رباتی با نظارت رشته‌ای بر هر گروه. Redis برای حالت توزیع‌شده. رشته‌های اختصاصی عملکرد مدیران را ردیابی می‌کنند.",
    },
  },
  {
    name: "CoD Marketplace",
    description: "Telegram bot marketplace for Call of Duty account trading with ZarinPal payment gateway, multi-level admin system, and KYC verification.",
    descriptionFa: "بازار ربات تلگرام برای معامله حساب‌های Call of Duty با درگاه پرداخت زاپرین‌پال، سیستم مدیریت چند سطحی و تأیید هویت.",
    tech: ["Python", "TeleBot", "Flask", "Redis", "ZarinPal"],
    architecture: {
      mermaid: `graph LR
  A[👤 Users] --> B[TeleBot Handler]
  B --> C[(Redis Store)]
  B --> D[ZarinPal SOAP]
  D --> E[Flask Callback]
  E --> C
  B --> F[Admin Panel]
  F --> C
  B --> G[Channel Verify]`,
      summary: "Single-bot marketplace with Redis dual-DB storage, ZarinPal SOAP payment integration via Flask webhook callbacks, channel membership verification, and multi-level admin controls.",
      summaryFa: "بازار تک رباتی با ذخیره‌سازی Redis، پرداخت ZarinPal از طریق Flask و کنترل‌های مدیریت چند سطحی.",
    },
  },
  {
    name: "PadaBot",
    description: "AI-powered multi-service Telegram bot with GPT integration, OCR, TTS, media downloading (Instagram, Spotify, SoundCloud, Pinterest), and educational tools for Iranian students.",
    descriptionFa: "ربات تلگرام چندسرویسی مبتنی بر هوش مصنوعی با GPT، OCR، TTS، دانلود رسانه و ابزارهای آموزشی برای دانشجویان ایرانی.",
    tech: ["Python", "Telethon", "OpenAI API", "Google Vision", "Tesseract OCR", "Redis", "SQLite"],
    architecture: {
      mermaid: `graph TD
  A[👤 Users] --> B[Event Handlers]
  B --> C[OpenAI GPT]
  B --> D[Media APIs]
  B --> E[OCR/TTS Engines]
  B --> F[Rate Limiter]
  F --> G[(Redis Cache)]
  B --> H[(SQLite DB)]
  D --> I[Instagram]
  D --> J[Spotify]
  D --> K[SoundCloud]`,
      summary: "Monolithic event-driven bot with 28+ handlers routing to external APIs (OpenAI, Instagram, Spotify). SQLite for persistence, Redis for rate limiting and caching. File system cache for media.",
      summaryFa: "ربات رویداد-محور با بیش از ۲۸ هندلر برای API‌های خارجی. SQLite برای ذخیره‌سازی و Redis برای محدودیت نرخ و کش.",
    },
  },
  {
    name: "IranConcert Scanner",
    description: "Automated seat scanner & reservation tool for IranConcert using Playwright browser automation. Configurable seat criteria, headless/headful modes, and real-time terminal feedback.",
    descriptionFa: "ابزار خودکار اسکن صندلی و رزرو برای ایران‌کنسرت با اتوماسیون مرورگر Playwright. معیارهای قابل تنظیم و بازخورد لحظه‌ای.",
    tech: ["Python", "Playwright", "Browser Automation", "AsyncIO"],
    architecture: {
      mermaid: `graph LR
  A[Config] --> B[Playwright Browser]
  B --> C[Seat Scanner]
  C --> D{Available?}
  D -->|Yes| E[Auto Reserve]
  D -->|No| F[Retry Loop]
  F --> C
  E --> G[Terminal Output]`,
      summary: "AsyncIO-driven Playwright browser automation that continuously scans IranConcert seat maps against configurable criteria. Headless/headful modes with real-time terminal feedback and automatic reservation on match.",
      summaryFa: "اتوماسیون مرورگر Playwright مبتنی بر AsyncIO که نقشه صندلی‌های ایران‌کنسرت را بر اساس معیارهای قابل تنظیم اسکن می‌کند. حالت‌های headless/headful با بازخورد لحظه‌ای و رزرو خودکار.",
    },
  },
  {
    name: "IauBot",
    description: "Production-grade Telegram dormitory reservation system with Redis-backed state management, multi-layer auth, MD5-based file sync, and comprehensive admin tools.",
    descriptionFa: "سیستم رزرو خوابگاه تلگرامی با مدیریت حالت Redis، احراز هویت چند لایه و ابزارهای مدیریت جامع.",
    tech: ["Python", "Telethon", "SQLite", "Redis", "Excel Import"],
    architecture: {
      mermaid: `graph TD
  A[Telegram Users] --> B[main.py Router]
  B --> C[Services Layer]
  C --> D[core/db.py]
  C --> E[core/redis_client.py]
  D --> F[(SQLite)]
  E --> G[(Redis)]
  C --> H[Excel Handler]
  B --> I[Rate Limiter]
  C --> J[Broadcast System]`,
      summary: "Modular Telethon bot with services layer (admin, broadcast, floor/room CRUD, Excel sync). SQLite for persistence with WAL mode, Redis for state/rate-limiting/admin roles. MD5-based file change detection for Excel imports.",
      summaryFa: "ربات ماژولار Telethon با لایه سرویس (مدیریت، پخش، CRUD طبقه/اتاق، همگام‌سازی اکسل). SQLite با حالت WAL، Redis برای حالت/محدودیت نرخ. تشخیص تغییر فایل مبتنی بر MD5.",
    },
  },
  {
    name: "Lottery Bot",
    description: "Telegram lottery bot with referral systems, mandatory channel subscriptions, categorized prizes, animated digit-by-digit draws, and anti-cheating measures.",
    descriptionFa: "ربات قرعه‌کشی تلگرام با سیستم ارجاع، اشتراک اجباری کانال، جوایز دسته‌بندی‌شده و اقدامات ضد تقلب.",
    tech: ["Python", "Pyrogram", "SQLite", "Raw Updates"],
    architecture: {
      mermaid: `graph TD
  A[Telegram Users] --> B[Pyrogram Bot]
  B --> C[Channel Verifier]
  C --> D[Code Generator]
  D --> E[(SQLite DB)]
  B --> F[Referral System]
  F --> E
  B --> G[Lottery Engine]
  G --> H[Animated Draw]
  G --> I[Winner Selector]
  I --> E
  B --> J[Raw Update Monitor]`,
      summary: "Event-driven Pyrogram bot with SQLite persistence. Channel membership enforced via Raw Updates monitoring. Lottery engine with categorized prizes, animated digit-by-digit reveals, and anti-cheating duplicate prevention.",
      summaryFa: "ربات رویداد-محور Pyrogram با ذخیره‌سازی SQLite. عضویت کانال از طریق Raw Updates اعمال می‌شود. موتور قرعه‌کشی با جوایز دسته‌بندی‌شده و نمایش رقم‌به‌رقم متحرک.",
    },
  },
  {
    name: "Redis MongoBackup",
    description: "Lightweight CLI tool for Redis and MongoDB backup/restore operations.",
    descriptionFa: "ابزار سبک CLI برای عملیات پشتیبان‌گیری و بازیابی Redis و MongoDB.",
    tech: ["Python", "Redis", "MongoDB", "CLI"],
    architecture: {
      mermaid: `graph LR
  A[CLI] --> B[Command Router]
  B --> C[Redis Handler]
  B --> D[MongoDB Handler]
  C --> E[Pattern Match]
  E --> F[(Redis Server)]
  D --> G[mongodump]
  D --> H[mongorestore]
  G --> I[(MongoDB)]
  H --> I
  C --> J[Backup Files]
  D --> J`,
      summary: "Unified CLI dispatches to two handlers: Python-native Redis operations (pattern-based key backup/restore/clear) and MongoDB shell wrappers (mongodump/mongorestore). Env-driven configuration with CLI flag overrides.",
      summaryFa: "CLI واحد به دو هندلر ارسال می‌کند: عملیات Redis بومی پایتون (پشتیبان‌گیری/بازیابی/پاکسازی مبتنی بر الگو) و پوشش‌دهنده‌های شل MongoDB (mongodump/mongorestore).",
    },
  },
  {
    name: "University News Aggregator",
    description: "Intelligent news aggregation monitoring 4 Iranian university news portals.",
    descriptionFa: "تجمیع هوشمند اخبار با نظارت بر ۴ پورتال خبری دانشگاه‌های ایرانی.",
    tech: ["Python", "Redis", "BeautifulSoup", "lxml"],
    architecture: {
      mermaid: `graph TD
  A[News Sources] --> B[HTML Parser]
  B --> C[URL Normalizer]
  C --> D[Dedup Filter]
  D --> E[(Redis Cache)]
  D --> F[Token Rotator]
  F --> G[Telegram API]
  G --> H[Multi-Channel]
  A --> I[iscanews.ir]
  A --> J[mehrnews.com]
  A --> K[ana.ir]
  A --> L[iau.ir]`,
      summary: "3-minute polling loop scrapes 4 Iranian university news portals. BeautifulSoup+lxml parsing, Redis SET NX for atomic deduplication with 7-day TTL. Token rotation across 5 bot tokens with flood protection and multi-channel broadcast.",
      summaryFa: "حلقه نظرسنجی ۳ دقیقه‌ای ۴ پورتال خبری دانشگاهی ایرانی را اسکرپ می‌کند. تجزیه BeautifulSoup+lxml، Redis SET NX برای حذف تکراری اتمیک با TTL هفت‌روزه. چرخش توکن بین ۵ ربات.",
    },
  },
  {
    name: "Self Telegram Bot",
    description: "Production-grade Pyrogram userbot with intelligent message archiving and deleted message recovery.",
    descriptionFa: "یوزربات Pyrogram با آرشیو هوشمند پیام و بازیابی پیام‌های حذف‌شده.",
    tech: ["Python", "Pyrogram", "Redis", "SQLite", "Edge TTS"],
    architecture: {
      mermaid: `graph TD
  A[Telegram MTProto] --> B[Pyrogram Client]
  B --> C[Handler Registry]
  C --> D[Command Handlers]
  C --> E[Raw Update Router]
  E --> F[DSave Recovery]
  E --> G[Profile Watch]
  D --> H[(Redis db7)]
  F --> I[(SQLite)]
  D --> J[External APIs]
  J --> K[yt-dlp/FFmpeg]
  J --> L[Edge TTS/STT]
  B --> M[Checker Loop]`,
      summary: "Modular userbot with 25+ handler modules in priority-ordered dispatch chain. Redis db7 for distributed state/feature flags, SQLite for deleted message forensics. Raw update pipeline handles message deletion recovery and profile change monitoring. Background Checker loop manages scheduled tasks.",
      summaryFa: "یوزربات ماژولار با بیش از ۲۵ ماژول هندلر در زنجیره ارسال اولویت‌بندی‌شده. Redis db7 برای حالت توزیع‌شده، SQLite برای فارنزیک پیام‌های حذف‌شده. خط لوله Raw Update بازیابی پیام و نظارت تغییر پروفایل را مدیریت می‌کند.",
    },
  },
  {
    name: "V2Ray Config Manager",
    description: "Flask-based web app for instant access to updated V2Ray configurations with Telegram Web App integration.",
    descriptionFa: "وب‌اپ Flask برای دسترسی فوری به پیکربندی‌های به‌روز V2Ray با یکپارچه‌سازی Telegram Web App.",
    tech: ["Flask", "Redis", "JavaScript", "Telegram Web App API"],
    architecture: {
      mermaid: `graph TD
  A[Telegram Web App] --> B[Flask Server]
  B --> C[(Redis Store)]
  C --> D[Config Generator]
  D --> E[V2Ray Configs]
  A --> F[JavaScript UI]
  F --> B`,
      summary: "Flask web application serving updated V2Ray configurations via Telegram Web App integration. Redis-backed config storage with instant access and automatic updates through the Telegram Mini App API.",
      summaryFa: "وب‌اپلیکیشن Flask برای ارائه پیکربندی‌های V2Ray از طریق Telegram Web App. ذخیره‌سازی Redis با دسترسی فوری و به‌روزرسانی خودکار از طریق API تلگرام مینی‌اپ.",
    },
  },
];

export const education: Education[] = [
  {
    degree: "B.Sc. Psychology",
    degreeFa: "کارشناسی روانشناسی",
    institution: "Islamic Azad University, Gorgan",
    institutionFa: "دانشگاه آزاد اسلامی، گرگان",
    period: "In Progress — Expected 2029",
    focus: "Cognitive Science & Human-Computer Interaction",
    focusFa: "علوم شناختی و تعامل انسان-رایانه",
  },
  {
    degree: "A.Sc. Computer Engineering",
    degreeFa: "کاردانی مهندسی کامپیوتر",
    institution: "Islamic Azad University, Gorgan",
    institutionFa: "دانشگاه آزاد اسلامی، گرگان",
    period: "2019 — 2024",
  },
];
