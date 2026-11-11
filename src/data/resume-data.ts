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
  repoUrl?: string;
  demoUrl?: string;
  focus?: string[];
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
  "name": "ALI KHALILI",
  "title": "Python Backend & Systems Automation Engineer",
  "location": "Gorgan, Iran",
  "phone": "",
  "email": "ali0.0kh1380@gmail.com",
  "telegram": "t.me/dibbed",
  "github": "github.com/dibbed",
  "summary": "Python developer focused on backend services, asynchronous automation, Telegram and MTProto tooling, and reliable developer workflows. Public projects include ComputerPilot MCP, TenantRAG, and a bilingual psychology learning platform. I study psychology alongside software engineering.",
  "availability": "Open to collaboration and technical conversations",
  "languages": [
    {
      "language": "Persian",
      "level": "Native"
    },
    {
      "language": "English",
      "level": "Technical documentation and communication"
    }
  ]
};

export const achievements: Achievement[] = [
  {
    "label": "Public Repositories",
    "value": "16"
  },
  {
    "label": "Supported OS Targets",
    "value": "3"
  },
  {
    "label": "Chemistry Elements",
    "value": "118"
  },
  {
    "label": "Featured Projects",
    "value": "11"
  }
];

export const skills: Skill[] = [
  {
    "category": "Languages",
    "categoryFa": "زبان‌های برنامه‌نویسی",
    "items": [
      {
        "name": "Python"
      },
      {
        "name": "TypeScript"
      },
      {
        "name": "JavaScript"
      },
      {
        "name": "SQL"
      },
      {
        "name": "Bash"
      }
    ]
  },
  {
    "category": "Frameworks",
    "categoryFa": "فریمورک‌ها",
    "items": [
      {
        "name": "FastAPI"
      },
      {
        "name": "Django / DRF"
      },
      {
        "name": "Next.js"
      },
      {
        "name": "React"
      },
      {
        "name": "Express"
      },
      {
        "name": "asyncio"
      }
    ]
  },
  {
    "category": "Automation & Telegram",
    "categoryFa": "اتوماسیون و تلگرام",
    "items": [
      {
        "name": "Model Context Protocol"
      },
      {
        "name": "Playwright"
      },
      {
        "name": "Pyrogram"
      },
      {
        "name": "Telethon"
      },
      {
        "name": "Aiogram"
      },
      {
        "name": "FFmpeg"
      }
    ]
  },
  {
    "category": "RAG & Language Tools",
    "categoryFa": "بازیابی و ابزارهای زبانی",
    "items": [
      {
        "name": "RAG"
      },
      {
        "name": "Embeddings"
      },
      {
        "name": "LLM Integration"
      },
      {
        "name": "Vector Search"
      },
      {
        "name": "TTS"
      },
      {
        "name": "Document Processing"
      }
    ]
  },
  {
    "category": "Databases",
    "categoryFa": "پایگاه داده",
    "items": [
      {
        "name": "PostgreSQL"
      },
      {
        "name": "Redis"
      },
      {
        "name": "SQLite"
      },
      {
        "name": "MongoDB"
      }
    ]
  },
  {
    "category": "Infrastructure",
    "categoryFa": "زیرساخت",
    "items": [
      {
        "name": "Linux"
      },
      {
        "name": "Windows"
      },
      {
        "name": "macOS CI"
      },
      {
        "name": "Docker"
      },
      {
        "name": "Nginx"
      },
      {
        "name": "GitHub Actions"
      },
      {
        "name": "Git"
      }
    ]
  },
  {
    "category": "Security",
    "categoryFa": "امنیت",
    "items": [
      {
        "name": "Tenant Isolation"
      },
      {
        "name": "API Key Hashing"
      },
      {
        "name": "SSRF Protection"
      },
      {
        "name": "Rate Limiting"
      },
      {
        "name": "Access Control"
      },
      {
        "name": "Input Validation"
      }
    ]
  },
  {
    "category": "Research & Product",
    "categoryFa": "پژوهش و محصول",
    "items": [
      {
        "name": "Knowledge Graphs"
      },
      {
        "name": "Scientific Provenance"
      },
      {
        "name": "Psychology Education"
      },
      {
        "name": "Persian RTL UI"
      },
      {
        "name": "Browser QA"
      }
    ]
  }
];

export const experiences: Experience[] = [
  {
    "title": "Backend & Automation Engineering",
    "titleFa": "توسعه بک‌اند و اتوماسیون",
    "company": "Independent / Freelance",
    "role": "Python Developer",
    "roleFa": "توسعه‌دهنده پایتون",
    "period": "Ongoing",
    "bullets": [
      "Build asynchronous Python services and Telegram automation workflows.",
      "Work with relational databases, Redis-backed state, task scheduling, and external API integrations.",
      "Design maintainable tools for browser automation, process management, and operational tasks."
    ],
    "bulletsFa": [
      "توسعه سرویس‌های ناهمزمان پایتون و ابزارهای اتوماسیون تلگرام.",
      "کار با پایگاه داده، مدیریت وضعیت با Redis، زمان‌بندی وظایف و اتصال به APIها.",
      "ساخت ابزارهای قابل نگهداری برای اتوماسیون مرورگر و مدیریت پردازه‌ها."
    ],
    "tech": [
      "Python",
      "asyncio",
      "Telegram MTProto",
      "Redis",
      "SQL"
    ]
  },
  {
    "title": "ComputerPilot MCP",
    "titleFa": "پروژه ComputerPilot MCP",
    "company": "Public GitHub Repository",
    "role": "Developer & Maintainer",
    "roleFa": "توسعه‌دهنده و نگهدارنده",
    "period": "2026",
    "bullets": [
      "Develop a typed MCP runtime for filesystem, terminal, Git, testing, code intelligence, and browser tasks.",
      "Implement durable jobs and workflows with restart recovery and mutation safeguards.",
      "Validate supported functionality across Windows, Linux, and macOS CI without claiming identical native desktop support."
    ],
    "bulletsFa": [
      "توسعه محیط MCP با ابزارهای نوع‌دار برای فایل‌ها، ترمینال، Git، تست، تحلیل کد و مرورگر.",
      "پیاده‌سازی کارهای ماندگار و گردش‌کارهای قابل بازیابی با محافظت از تغییرات.",
      "آزمایش قابلیت‌های قابل پشتیبانی در Windows و Linux و CI مک، بدون ادعای پشتیبانی یکسان دسکتاپ."
    ],
    "tech": [
      "Python",
      "MCP",
      "SQLite",
      "Playwright",
      "GitHub Actions"
    ]
  },
  {
    "title": "Multi-Tenant Retrieval Systems",
    "titleFa": "سیستم‌های بازیابی چندمستاجری",
    "company": "TenantRAG (Public Repository)",
    "role": "Backend Developer",
    "roleFa": "توسعه‌دهنده بک‌اند",
    "period": "2026",
    "bullets": [
      "Build a FastAPI-based RAG framework with authenticated tenant-scoped retrieval.",
      "Separate vector storage and semantic caching per tenant; use hashed API keys and request validation.",
      "Document security boundaries and verify isolation through automated tests."
    ],
    "bulletsFa": [
      "ساخت فریمورک RAG با FastAPI و بازیابی اطلاعات محدود به هر مستاجر.",
      "جداسازی فضای برداری و کش معنایی هر مستاجر همراه با کلیدهای API هش‌شده.",
      "مستندسازی مرزهای امنیتی و آزمون خودکار جداسازی داده‌ها."
    ],
    "tech": [
      "FastAPI",
      "Python",
      "Vector Search",
      "API Security",
      "pytest"
    ]
  },
  {
    "title": "Psychology Learning Tools",
    "titleFa": "ابزارهای یادگیری روانشناسی",
    "company": "Psychology Atlas (Public Repository)",
    "role": "Full-Stack Developer",
    "roleFa": "توسعه‌دهنده فول‌استک",
    "period": "2026",
    "bullets": [
      "Develop a Persian-first psychology learning application with Django and Next.js.",
      "Build educational knowledge graphs and source-aware Brain and Assessment reference sections.",
      "Keep scientific source attribution, content rights, and non-diagnostic boundaries explicit."
    ],
    "bulletsFa": [
      "توسعه وب‌اپ آموزشی فارسی‌محور روانشناسی با Django و Next.js.",
      "ساخت گراف دانش و بخش‌های مرجع اطلس مغز و ابزارهای سنجش بر اساس منابع.",
      "رعایت ارجاع علمی، حقوق محتوا و مرز روشن بین آموزش و تشخیص بالینی."
    ],
    "tech": [
      "Python",
      "Django",
      "Next.js",
      "PostgreSQL",
      "Scientific Sources"
    ]
  }
];

export const projects: Project[] = [
  {
    "name": "ComputerPilot MCP",
    "description": "Cross-platform MCP runtime for developer automation: typed file, terminal, Git, browser and code tools, plus durable jobs, workflows and recovery safeguards. Windows has additional native desktop automation.",
    "descriptionFa": "محیط MCP چندسکویی برای اتوماسیون توسعه: ابزارهای نوع‌دار فایل، ترمینال، Git، مرورگر و تحلیل کد، همراه با کارهای ماندگار و بازیابی پس از خطا. اتوماسیون دسکتاپ بومی در ویندوز هم ارائه می‌شود.",
    "tech": [
      "Python",
      "MCP",
      "SQLite",
      "Playwright",
      "LSP",
      "GitHub Actions"
    ],
    "repoUrl": "https://github.com/dibbed/computerpilot-mcp",
    "focus": [
      "Backend",
      "DevOps",
      "Automation"
    ],
    "architecture": {
      "mermaid": "flowchart LR\n Agent[Agent] --> MCP[MCP Runtime]\n MCP --> Tools[Typed Tools]\n Tools --> FS[Files and Git]\n Tools --> Browser[Browser and Code]\n MCP --> Jobs[Durable Jobs]\n Jobs --> Store[(SQLite State)]",
      "summary": "MCP runtime exposes typed tools. Long-running jobs and workflows use persistent state and recovery safeguards. Platform-specific features are capability-gated.",
      "summaryFa": "محیط MCP ابزارهای نوع‌دار ارائه می‌کند. کارهای طولانی و گردش‌کارها دارای وضعیت ماندگار و محافظت در بازیابی هستند. امکانات وابسته به سیستم‌عامل جداگانه فعال می‌شوند."
    }
  },
  {
    "name": "TenantRAG",
    "description": "Multi-tenant retrieval framework built with FastAPI. Isolates tenant vector stores and semantic caches, authenticates requests with hashed API keys, and documents its security boundaries.",
    "descriptionFa": "فریمورک بازیابی اطلاعات چندمستاجری با FastAPI. فضای برداری و کش معنایی هر مستاجر جداست، کلیدهای API هش می‌شوند و مرزهای امنیتی مستند شده‌اند.",
    "tech": [
      "Python",
      "FastAPI",
      "RAG",
      "Vector Search",
      "API Security"
    ],
    "repoUrl": "https://github.com/dibbed/tenant-rag",
    "focus": [
      "Backend",
      "AI/ML"
    ],
    "architecture": {
      "mermaid": "flowchart LR\n Client[API Client] --> Auth[Authentication]\n Auth --> Tenant[Tenant Scope]\n Tenant --> Vector[(Tenant Vector Store)]\n Tenant --> Cache[(Tenant Cache)]\n Vector --> Answer[Retrieval Result]\n Cache --> Answer",
      "summary": "The request boundary authenticates a principal and restricts retrieval and caching to its tenant namespace; this does not imply encryption at rest.",
      "summaryFa": "هر درخواست احراز هویت می‌شود و بازیابی و کش فقط در محدوده همان مستاجر انجام می‌شود. این جداسازی به معنی رمزنگاری داده‌ها در حالت ذخیره‌شده نیست."
    }
  },
  {
    "name": "Psychology Atlas",
    "description": "Persian-first educational web app with Django/DRF and Next.js. Organizes psychology concepts, sourced knowledge graphs, Brain Atlas and assessment references. Educational, not diagnostic.",
    "descriptionFa": "وب‌اپ آموزشی فارسی‌محور با Django/DRF و Next.js برای مفاهیم روانشناسی، گراف دانش مستند، اطلس مغز و اطلاعات مرجع سنجش. ابزار تشخیص بالینی نیست.",
    "tech": [
      "Python",
      "Django",
      "Next.js",
      "PostgreSQL",
      "Knowledge Graph"
    ],
    "repoUrl": "https://github.com/dibbed/psychology-atlas",
    "focus": [
      "Backend",
      "Frontend",
      "Psychology"
    ],
    "architecture": {
      "mermaid": "flowchart LR\n UI[Next.js UI] --> API[Django REST API]\n API --> DB[(PostgreSQL)]\n API --> Graph[Knowledge Graph]\n Graph --> Sources[Reviewed Sources]",
      "summary": "A bilingual learning interface reads reviewed educational records and relationships through Django APIs. The repository documents licensing and scientific provenance.",
      "summaryFa": "رابط آموزشی دوزبانه، داده‌ها و روابط بازبینی‌شده را از APIهای Django می‌خواند. منبع داده علمی و محدودیت مجوزهای محتوا مستند است."
    }
  },
  {
    "name": "Telegram Voice Streaming Engine",
    "description": "Telegram voice-chat streaming project with MTProto helper-session pooling, FFmpeg media processing, PostgreSQL state and Redis-backed coordination, plus stream recovery mechanisms.",
    "descriptionFa": "پروژه پخش صوت در تماس‌های گروهی تلگرام با استخر نشست‌های MTProto، پردازش رسانه با FFmpeg، ذخیره‌سازی PostgreSQL، هماهنگی Redis و سازوکار بازیابی پخش.",
    "tech": [
      "Python",
      "Pyrogram",
      "PyTgCalls",
      "FFmpeg",
      "Redis",
      "PostgreSQL"
    ],
    "repoUrl": "https://github.com/dibbed/tg-vc-player-saas",
    "focus": [
      "Backend",
      "DevOps",
      "Automation"
    ],
    "architecture": {
      "mermaid": "flowchart LR\n Telegram[Telegram Group] --> Pool[Helper Pool]\n Pool --> Media[FFmpeg Pipeline]\n Pool --> Redis[(Redis Coordination)]\n Pool --> DB[(PostgreSQL State)]\n Media --> Call[Voice Stream]",
      "summary": "Streaming orchestration coordinates helper sessions, media processing and persisted playback state. Claims of deployed scale are intentionally omitted.",
      "summaryFa": "هماهنگی پخش شامل نشست‌های کمکی، پردازش رسانه و ذخیره وضعیت پخش است. آمار مربوط به مقیاس استقرار بدون مدرک ذکر نشده است."
    }
  },
  {
    "name": "Smart Periodic Table",
    "description": "Interactive periodic table with 118 elements, 3D models, element search and chemistry challenges. React and Three.js frontend; Node/Express API in the full-stack repository. Live demo runs statically on GitHub Pages.",
    "descriptionFa": "جدول تناوبی تعاملی با ۱۱۸ عنصر، مدل‌های سه‌بعدی، جستجو و چالش شیمی. فرانت‌اند React و Three.js و API با Express در سورس کامل؛ نسخه نمایشی روی GitHub Pages ایستا است.",
    "tech": [
      "React",
      "Three.js",
      "Vite",
      "Express",
      "SQLite"
    ],
    "repoUrl": "https://github.com/dibbed/smart-periodic-table-fullstack",
    "focus": [
      "Backend",
      "Frontend"
    ],
    "architecture": {
      "mermaid": "flowchart LR\n UI[React and Three.js] --> Data[Element Dataset]\n API[Express API] --> DB[(SQLite)]\n API --> Data\n Demo[GitHub Pages Demo] --> UI",
      "summary": "The repository includes a Node/Express API and SQLite. The public Pages demo bundles element data and does not run the Express server.",
      "summaryFa": "سورس پروژه شامل API با Express و پایگاه SQLite است، اما نسخه عمومی GitHub Pages داده عناصر را در مرورگر بارگذاری می‌کند و سرور Express ندارد."
    },
    "demoUrl": "https://dibbed.github.io/smart-periodic-table-fullstack/"
  },
  {
    "name": "TTSKit",
    "description": "Python text-to-speech toolkit routing Persian and other text through Edge, Google and Piper engines. Includes FastAPI, CLI, Telegram adapters, caching and FFmpeg audio output.",
    "descriptionFa": "ابزار تبدیل متن به گفتار پایتون با مسیریابی بین موتورهای Edge، Google و Piper و تمرکز روی فارسی. شامل FastAPI، CLI، اتصال تلگرام، کش و خروجی صوتی FFmpeg.",
    "tech": [
      "Python",
      "FastAPI",
      "Edge TTS",
      "Piper",
      "Typer",
      "FFmpeg"
    ],
    "repoUrl": "https://github.com/dibbed/TTSKit-multi-engine-tts",
    "focus": [
      "Backend",
      "AI/ML"
    ],
    "architecture": {
      "mermaid": "flowchart LR\n CLI[CLI] --> Router[Engine Router]\n API[FastAPI] --> Router\n Telegram[Telegram] --> Router\n Router --> Engines[TTS Engines]\n Engines --> Audio[FFmpeg Output]",
      "summary": "A common router selects supported TTS engines for API, command-line and Telegram entry points, with caching and audio conversion.",
      "summaryFa": "مسیریاب مشترک موتور تبدیل گفتار را برای API، خط فرمان و ورودی تلگرام انتخاب می‌کند و از کش و تبدیل صوت پشتیبانی می‌کند."
    }
  },
  {
    "name": "CLI Orchestrator",
    "description": "Python command-line harness that separates task planning from execution using an orchestrator and an isolated worker, with timeout and error handling.",
    "descriptionFa": "چارچوب خط فرمان پایتونی که برنامه‌ریزی کار را از اجرای آن جدا می‌کند. عامل هماهنگ‌کننده و عامل اجرایی مجزا دارد و زمان‌پایان و خطاها را مدیریت می‌کند.",
    "tech": [
      "Python",
      "CLI",
      "Subprocess",
      "Agent Workflow"
    ],
    "repoUrl": "https://github.com/dibbed/cli-orchestrator",
    "focus": [
      "Automation",
      "AI/ML"
    ],
    "architecture": {
      "mermaid": "flowchart LR\n Task[Task] --> Planner[Orchestrator]\n Planner --> Worker[Isolated Worker]\n Worker --> Result[Structured Result]\n Result --> Planner",
      "summary": "A Python harness hands off structured tasks to an isolated worker process and handles process failures and timeouts.",
      "summaryFa": "چارچوب پایتونی، وظیفه‌های ساختاریافته را به پردازه اجرایی جداگانه واگذار می‌کند و خطاها و پایان زمان را مدیریت می‌کند."
    }
  },
  {
    "name": "JobVision Auto-Apply",
    "description": "Playwright-based job browsing and application automation with geographic and remote-work filters, saved application history, and optional model-assisted matching.",
    "descriptionFa": "اتوماسیون مرور فرصت‌های شغلی با Playwright، فیلتر دورکاری و موقعیت مکانی، ذخیره سوابق درخواست و تطبیق اختیاری با مدل زبانی.",
    "tech": [
      "Python",
      "Playwright",
      "Browser Automation",
      "CSV"
    ],
    "repoUrl": "https://github.com/dibbed/jobvision-auto-apply",
    "focus": [
      "Automation"
    ],
    "architecture": {
      "mermaid": "flowchart LR\n Filters[Job Filters] --> Browser[Playwright]\n Browser --> Jobs[Matching Listings]\n Jobs --> Review[Application Flow]\n Review --> Log[Application History]",
      "summary": "Browser automation filters listings and records application attempts for review. It depends on the target site's current behavior.",
      "summaryFa": "اتوماسیون مرورگر آگهی‌ها را فیلتر می‌کند و سابقه درخواست‌ها را ثبت می‌کند. عملکرد آن به تغییرات سایت مقصد وابسته است."
    }
  },
  {
    "name": "Nginx SSL Auto",
    "description": "CLI utility for configuring Nginx reverse proxies and obtaining Let's Encrypt certificates through Certbot, including redirects and validation.",
    "descriptionFa": "ابزار خط فرمان برای پیکربندی پروکسی معکوس Nginx و گرفتن گواهی Let's Encrypt با Certbot، همراه با ریدایرکت و اعتبارسنجی.",
    "tech": [
      "Python",
      "Nginx",
      "Certbot",
      "TLS",
      "CLI"
    ],
    "repoUrl": "https://github.com/dibbed/nginx-ssl-auto",
    "focus": [
      "DevOps",
      "Automation"
    ],
    "architecture": {
      "mermaid": "flowchart LR\n CLI[CLI] --> Config[Nginx Config]\n CLI --> Certbot[Certbot]\n Certbot --> TLS[TLS Certificate]\n Config --> Server[Nginx]\n TLS --> Server",
      "summary": "The CLI coordinates Nginx configuration, Certbot certificate issuance and optional HTTP-to-HTTPS redirects.",
      "summaryFa": "ابزار خط فرمان تنظیمات Nginx و صدور گواهی Certbot و ریدایرکت اختیاری HTTP به HTTPS را هماهنگ می‌کند."
    }
  },
  {
    "name": "IranConcert Scanner",
    "description": "Playwright automation for scanning seating maps, finding adjacent available seats using configurable criteria, and preserving authenticated browser sessions.",
    "descriptionFa": "اتوماسیون Playwright برای بررسی نقشه سالن، پیدا کردن صندلی‌های آزاد مجاور با معیارهای قابل تنظیم و نگهداری نشست ورود مرورگر.",
    "tech": [
      "Python",
      "Playwright",
      "Browser Automation"
    ],
    "repoUrl": "https://github.com/dibbed/iranconcert_scanner",
    "focus": [
      "Automation"
    ],
    "architecture": {
      "mermaid": "flowchart LR\n Browser[Browser Session] --> Map[Seat Map]\n Map --> Scan[Availability Scan]\n Scan --> Match[Adjacent Seat Match]\n Match --> Result[Reservation Flow]",
      "summary": "Browser automation inspects seat availability and can follow the configured reservation flow; outcomes depend on current website state.",
      "summaryFa": "اتوماسیون مرورگر ظرفیت صندلی‌ها را بررسی می‌کند و بر اساس تنظیمات وارد روند رزرو می‌شود. نتیجه به وضعیت فعلی سایت بستگی دارد."
    }
  },
  {
    "name": "Redis & Mongo Backup Tool",
    "description": "Small Python CLI for pattern-based Redis key backup and restore, plus MongoDB database dumps and restores using MongoDB Database Tools.",
    "descriptionFa": "ابزار سبک خط فرمان پایتون برای پشتیبان‌گیری و بازیابی کلیدهای Redis بر اساس الگو و عملیات dump و restore پایگاه MongoDB.",
    "tech": [
      "Python",
      "Redis",
      "MongoDB",
      "CLI"
    ],
    "repoUrl": "https://github.com/dibbed/redis-mongo-backup-tool",
    "focus": [
      "Backend",
      "DevOps"
    ],
    "architecture": {
      "mermaid": "flowchart LR\n CLI[CLI] --> Redis[Redis Handler]\n CLI --> Mongo[MongoDB Tools]\n Redis --> Files[Backup Files]\n Mongo --> Files",
      "summary": "An environment-configured CLI routes backup and restore requests to Redis operations and mongodump/mongorestore.",
      "summaryFa": "ابزار خط فرمان با تنظیمات محیطی عملیات پشتیبان‌گیری و بازیابی را به Redis و ابزارهای mongodump و mongorestore ارجاع می‌دهد."
    }
  }
];

export const education: Education[] = [
  {
    "degree": "Psychology (In Progress)",
    "degreeFa": "روانشناسی (در حال تحصیل)",
    "institution": "Islamic Azad University, Gorgan",
    "institutionFa": "دانشگاه آزاد اسلامی، گرگان",
    "period": "In progress",
    "focus": "Psychology, learning and research",
    "focusFa": "روانشناسی، یادگیری و پژوهش"
  },
  {
    "degree": "Software Engineering Practice",
    "degreeFa": "توسعه نرم‌افزار به شکل پروژه‌محور",
    "institution": "Independent learning & open-source projects",
    "institutionFa": "یادگیری مستقل و پروژه‌های عمومی",
    "period": "Ongoing",
    "focus": "Backend engineering, automation and systems",
    "focusFa": "بک‌اند، اتوماسیون و سیستم‌ها"
  }
];
