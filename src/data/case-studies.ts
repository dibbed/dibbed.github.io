/**
 * Editorial portfolio case studies, grounded in public repository files.
 * These explain design decisions and repository-documented validation;
 * they do not imply a deployed SaaS service or independently executed tests.
 */
export type Localized = { en: string; fa: string };

export interface CaseStudyEvidence {
  label: Localized;
  description: Localized;
  kind: "architecture" | "test" | "workflow" | "audit" | "rights";
  path: string;
}

export interface CaseStudyDecision {
  title: Localized;
  choice: Localized;
  tradeoff: Localized;
  source: string;
}

export interface CaseStudyNode {
  name: Localized;
  role: Localized;
}

export interface CaseStudy {
  slug: string;
  projectName: string;
  repo: string;
  /** Exact public source revision inspected for this story. */
  sourceCommit: string;
  category: Localized;
  headline: Localized;
  deck: Localized;
  challenge: Localized;
  implementation: Localized;
  outcome: Localized;
  honestLimit: Localized;
  stats: { value: string; label: Localized; detail: Localized }[];
  tech: string[];
  flow: CaseStudyNode[];
  decisions: CaseStudyDecision[];
  evidence: CaseStudyEvidence[];
  scopeNote: Localized;
}

const L = (en: string, fa: string): Localized => ({ en, fa });

export const caseStudies: CaseStudy[] = [
  {
    slug: "computerpilot-mcp",
    projectName: "ComputerPilot MCP",
    repo: "computerpilot-mcp",
    sourceCommit: "cb532f3894561f83bf3a8670883ee36eb126c6c4",
    category: L("Developer infrastructure / automation", "زیرساخت توسعه و اتوماسیون"),
    headline: L(
      "Automation that knows when not to retry.",
      "اتوماسیونی که می‌داند چه زمانی نباید دوباره اجرا شود."
    ),
    deck: L(
      "A typed MCP runtime connecting development agents to files, Git, terminal processes, browser sessions and long-running workflows, with explicit boundaries around uncertain side effects.",
      "یک محیط اجرایی MCP با ابزارهای نوع‌دار برای فایل، Git، پردازه‌ها، مرورگر و گردش‌کارهای طولانی؛ همراه با مدیریت روشن عملیات‌هایی که نتیجه‌شان پس از قطعی نامشخص است."
    ),
    challenge: L(
      "Developer automation changes real systems. When a process crashes after a write, blindly replaying the step may repeat a commit, mutation or external action. The runtime also has to expose different capabilities on Windows, Linux and macOS without pretending their desktop support is identical.",
      "اتوماسیون توسعه در سیستم واقعی تغییر ایجاد می‌کند. اگر پردازه بعد از یک عملیات نوشتن از کار بیفتد، تکرار کورکورانه ممکن است یک تغییر یا عمل خارجی را دوباره انجام دهد. از طرفی امکانات ویندوز، لینوکس و مک هم یکسان نیست."
    ),
    implementation: L(
      "The project separates typed tool admission, operation execution, persisted job/workflow state and recovery. Durable checkpoints record progress; uncertain changes are inspected and reconciled rather than silently assumed successful or safe to repeat. Platform capability gates distinguish portable tools from Windows-only native desktop functions.",
      "سیستم اعتبارسنجی ابزار، اجرای عملیات، وضعیت ماندگار Job و Workflow و بازیابی را از هم جدا می‌کند. چک‌پوینت‌ها پیشرفت را ثبت می‌کنند و عملیات نامطمئن به‌جای تکرار خودکار، بررسی و تطبیق داده می‌شوند. محدودیت‌های هر سیستم‌عامل نیز در سطح قابلیت اعمال شده‌اند."
    ),
    outcome: L(
      "A public developer-tooling runtime with recovery-oriented workflows, filesystem and process safeguards, and a documented cross-platform quality matrix. The source includes portable browser tooling and Windows-specific native UI automation.",
      "یک محیط ابزار توسعه با گردش‌کارهای قابل بازیابی، محافظت از فایل و پردازه، و ماتریس مستند آزمایش چندسکویی. اتوماسیون مرورگر قابل حمل است و امکانات بومی دسکتاپ به ویندوز محدود می‌شود."
    ),
    honestLimit: L(
      "Recovery cannot make arbitrary external side effects transactional. Linux/macOS are documented as Preview, and macOS physical desktop acceptance is not claimed. The project is a local agent runtime, not a publicly hosted control plane.",
      "بازیابی نمی‌تواند همه اثرات خارجی را تراکنشی کند. لینوکس و مک در مستندات با وضعیت Preview مشخص شده‌اند و پذیرش دسکتاپ واقعی روی مک ادعا نشده است. این یک محیط اجرایی محلی است، نه سرویس کنترل عمومی روی اینترنت."
    ),
    stats: [
      { value: "3", label: L("CI operating systems", "سیستم‌عامل در CI"), detail: L("Windows, Linux and macOS; native coverage differs", "ویندوز، لینوکس و مک با سطح پشتیبانی متفاوت") },
      { value: "SQLite", label: L("Durable job state", "وضعیت ماندگار"), detail: L("Persisted workflows and checkpoints", "گردش‌کار و چک‌پوینت") },
      { value: "MCP", label: L("Typed tool interface", "رابط ابزار نوع‌دار"), detail: L("Capability-gated operations", "عملیات وابسته به قابلیت سیستم") },
    ],
    tech: ["Python", "MCP", "SQLite", "Playwright", "LSP", "GitHub Actions"],
    flow: [
      { name: L("Agent request", "درخواست ایجنت"), role: L("Typed MCP tool call", "فراخوانی ابزار نوع‌دار") },
      { name: L("Admission", "پذیرش"), role: L("Schema and capability checks", "اعتبارسنجی و کنترل قابلیت") },
      { name: L("Execution", "اجرا"), role: L("File, Git, browser or process work", "کار روی فایل، Git، مرورگر یا پردازه") },
      { name: L("Checkpoint", "چک‌پوینت"), role: L("Persist operation and workflow state", "ذخیره وضعیت عملیات و گردش‌کار") },
      { name: L("Reconciliation", "تطبیق"), role: L("Investigate uncertain side effects", "بررسی اثرات نامطمئن") },
    ],
    decisions: [
      {
        title: L("Reconcile instead of replay", "تطبیق به جای اجرای مجدد"),
        choice: L("Mark uncertain mutations and require investigation before acknowledgement.", "عملیات تغییردهنده نامطمئن علامت‌گذاری می‌شود تا پیش از تأیید بررسی شود."),
        tradeoff: L("This adds an explicit recovery step, but avoids claiming an external write is safely repeatable.", "بازیابی مرحله بیشتری دارد، ولی از فرض اشتباه درباره امن بودن تکرار عملیات جلوگیری می‌کند."),
        source: "README.md",
      },
      {
        title: L("Durable local state", "وضعیت ماندگار محلی"),
        choice: L("Keep workflow and job checkpoints in SQLite.", "چک‌پوینت‌های کار و گردش‌کار در SQLite ذخیره می‌شوند."),
        tradeoff: L("Simplifies a local-first runtime, without pretending the journal can roll back external systems.", "برای یک ابزار محلی ساده‌تر است، اما ژورنال نمی‌تواند سیستم‌های خارجی را Rollback کند."),
        source: "docs/architecture.md",
      },
      {
        title: L("Capability-aware portability", "قابلیت‌محوری در چندسکویی"),
        choice: L("Expose portable operations across platforms and gate Windows-native desktop tools.", "عملیات قابل حمل ارائه می‌شوند و امکانات بومی ویندوز محدودسازی جداگانه دارند."),
        tradeoff: L("Platform support stays uneven but truthful; there is no false promise of desktop parity.", "پشتیبانی سیستم‌عامل‌ها کاملاً یکسان نیست، اما وعده غیرواقعی به کاربر داده نمی‌شود."),
        source: "tests/test_platform_capabilities.py",
      },
    ],
    evidence: [
      { kind: "architecture", label: L("Architecture and component boundaries", "معماری و مرز کامپوننت‌ها"), description: L("The runtime, orchestration and recovery model.", "ساختار اجرای ابزار، هماهنگی و بازیابی."), path: "docs/architecture.md" },
      { kind: "test", label: L("Platform capability regression", "تست قابلیت‌های سیستم‌عامل"), description: L("Actual source tests of supported and gated capabilities.", "فایل واقعی تست امکانات مجاز و محدودشده."), path: "tests/test_platform_capabilities.py" },
      { kind: "workflow", label: L("Platform validation workflow", "گردش‌کار اعتبارسنجی"), description: L("GitHub Actions configuration for cross-platform release checks.", "پیکربندی CI برای بررسی نسخه روی سیستم‌عامل‌های مختلف."), path: ".github/workflows/platform-validation.yml" },
      { kind: "audit", label: L("Testing standards", "استانداردهای تست"), description: L("Maintainer-defined quality and verification practices.", "چارچوب کنترل کیفیت و روش‌های اعتبارسنجی پروژه."), path: "docs/development/TESTING-STANDARDS.md" },
    ],
    scopeNote: L(
      "Source snapshot: public repository reviewed on 21 Nov 2026. Test and platform claims are scoped to the repository's own documentation, not a new external certification.",
      "منبع: ریپازیتوری عمومی بررسی‌شده در ۲۱ نوامبر ۲۰۲۶. اطلاعات تست و پلتفرم از مستندات همان پروژه است و به‌معنای تأیید مستقل جدید نیست."
    ),
  },
  {
    slug: "tenant-rag",
    projectName: "TenantRAG",
    repo: "tenant-rag",
    sourceCommit: "362b8a6a008d62419566f35655b3c935c9c2021b",
    category: L("Backend / multi-tenant retrieval", "بک‌اند و بازیابی چندمستاجری"),
    headline: L(
      "Retrieval boundaries matter more than a clever answer.",
      "مرز دسترسی به داده مهم‌تر از یک پاسخ هوشمندانه است."
    ),
    deck: L(
      "An API-first RAG microservice designed for SaaS backends, where authentication, vector retrieval and semantic caches all need to honor the same tenant boundary.",
      "یک میکروسرویس RAG مبتنی بر API برای بک‌اند SaaS که در آن احراز هویت، جست‌وجوی برداری و کش معنایی باید مرز یکسانی برای داده هر مستاجر داشته باشند."
    ),
    challenge: L(
      "A shared retrieval engine is useful until one customer's document, cache entry or API key can influence another customer's result. The difficult part is keeping authorization consistent across storage, caching, ingestion, metadata and concurrent requests.",
      "موتور بازیابی مشترک تا وقتی مفید است که سند، کش یا کلید API یک مشتری وارد نتیجه مشتری دیگر نشود. چالش اصلی حفظ یک مرز امنیتی در ذخیره‌سازی، کش، ورود اسناد، متادیتا و درخواست‌های هم‌زمان است."
    ),
    implementation: L(
      "The service resolves caller identity through API keys stored as salted scrypt hashes, enforces tenant-scoped storage and semantic-cache partitions, and uses tenant-scoped metadata/database rules. The code supports FAISS, ChromaDB and Qdrant, with security regression tests for authorization, tenant isolation and SSRF-sensitive inputs.",
      "سرویس هویت درخواست‌کننده را با کلیدهای API هش‌شده با scrypt و نمک مستقل مشخص می‌کند، داده برداری و کش معنایی را به مستاجر محدود می‌کند و برای متادیتا مرزهای پایگاه‌داده دارد. از FAISS، ChromaDB و Qdrant پشتیبانی می‌کند و تست‌های امنیتی برای مجوزها، جداسازی مستأجر و ورودی‌های SSRF دارد."
    ),
    outcome: L(
      "An inspectable FastAPI service with tenant provisioning, RAG query/ingest endpoints, multiple vector backends, provider selection and security-oriented CI. The repository also includes reproducible benchmark scripts rather than unverifiable latency claims.",
      "یک سرویس FastAPI قابل بررسی با ساخت مستاجر، API ورود و پرسش از اسناد، چند موتور برداری، انتخاب ارائه‌دهنده مدل و CI با تمرکز امنیت. اسکریپت‌های بنچمارک هم داخل ریپازیتوری هستند تا عملکرد در محیط واقعی سنجیده شود."
    ),
    honestLimit: L(
      "Filesystem partitions are not disk encryption. Optional model providers and vector engines have different deployment requirements; benchmark scripts must be run in a known environment before any production latency comparison.",
      "جداسازی فایل‌ها به معنای رمزنگاری دیسک نیست. ارائه‌دهنده‌های مدل و موتورهای برداری شرایط استقرار متفاوتی دارند و برای ادعای سرعت عملیاتی باید بنچمارک در محیط مشخص اجرا شود."
    ),
    stats: [
      { value: "3", label: L("Vector backends", "موتور برداری"), detail: L("FAISS, ChromaDB, Qdrant", "FAISS، ChromaDB و Qdrant") },
      { value: "scrypt", label: L("API-key storage", "ذخیره کلید API"), detail: L("Salted hashes, not plaintext secrets", "هش نمک‌دار به جای کلید خام") },
      { value: "RLS", label: L("Metadata isolation", "جداسازی متادیتا"), detail: L("PostgreSQL row-level security", "امنیت سطح ردیف PostgreSQL") },
    ],
    tech: ["FastAPI", "PostgreSQL", "Redis", "FAISS", "ChromaDB", "Qdrant", "pytest"],
    flow: [
      { name: L("API request", "درخواست API"), role: L("Key and tenant context", "کلید و هویت مستاجر") },
      { name: L("Authorization", "مجوز"), role: L("Tenant scope and access checks", "کنترل محدوده مستاجر") },
      { name: L("Ingestion / query", "ورود یا پرسش"), role: L("Load, chunk, embed or retrieve", "بارگذاری، بخش‌بندی، embedding و بازیابی") },
      { name: L("Tenant partition", "فضای مستاجر"), role: L("Vector store and semantic cache", "فضای برداری و کش معنایی") },
      { name: L("Grounded response", "پاسخ مستند"), role: L("Return context-backed content", "پاسخ بر پایه محتوای بازیابی‌شده") },
    ],
    decisions: [
      {
        title: L("Tenant boundaries across layers", "مرز مستاجر در چند لایه"),
        choice: L("Partition vector indices and semantic cache by authenticated tenant, with database-level constraints for metadata.", "ایندکس برداری و کش با هویت مستاجر جدا می‌شوند و متادیتا هم کنترل پایگاه‌داده دارد."),
        tradeoff: L("Isolation adds storage/key-management complexity, but reduces cross-tenant exposure paths.", "پیچیدگی مدیریت کلید و ذخیره‌سازی بیشتر می‌شود، اما مسیرهای نشت داده بین مستأجرها کمتر می‌شود."),
        source: "tests/integration/test_multi_tenant_isolation.py",
      },
      {
        title: L("Hashed API keys", "هش کلیدهای API"),
        choice: L("Store salted scrypt hashes and verify keys by identifier with constant-time comparison.", "هش نمک‌دار scrypt ذخیره می‌شود و بررسی کلید با شناسه و مقایسه ثابت‌زمان انجام می‌شود."),
        tradeoff: L("Credential verification is more expensive than a naive lookup, but the original secret is not retained.", "بررسی اعتبار نسبت به مقایسه ساده هزینه بیشتری دارد، ولی متن کلید حفظ نمی‌شود."),
        source: "tests/security/test_phase2_api_key_hashing.py",
      },
      {
        title: L("Reproducible measurement", "اندازه‌گیری بازتولیدپذیر"),
        choice: L("Ship cache, memory, concurrency and ingest benchmark scripts with environment-dependent output.", "اسکریپت‌های بنچمارک کش، حافظه، هم‌زمانی و ورود سند همراه پروژه ارائه شده‌اند."),
        tradeoff: L("No single impressive latency number is universally defensible across model providers and stores.", "یک عدد سرعت واحد برای همه مدل‌ها و موتورهای برداری قابل تعمیم نیست."),
        source: "benchmarks/bench_cache.py",
      },
    ],
    evidence: [
      { kind: "architecture", label: L("TenantRAG system architecture", "معماری TenantRAG"), description: L("FastAPI, retrieval, storage and cache layering.", "لایه‌های FastAPI، بازیابی، ذخیره‌سازی و کش."), path: "docs/ARCHITECTURE.md" },
      { kind: "test", label: L("Tenant isolation integration tests", "تست یکپارچه جداسازی مستأجر"), description: L("Security boundaries under real service interactions.", "مرزهای امنیتی در تعامل سرویس."), path: "tests/integration/test_multi_tenant_isolation.py" },
      { kind: "test", label: L("API-key hashing tests", "تست هش کلید API"), description: L("Credential hashing and verification behavior.", "رفتار ذخیره و بررسی کلید."), path: "tests/security/test_phase2_api_key_hashing.py" },
      { kind: "test", label: L("SSRF protection tests", "تست محافظت SSRF"), description: L("Input and outbound request safety checks.", "کنترل ورودی‌ها و درخواست‌های خروجی."), path: "tests/security/test_phase2_ssrf_protection.py" },
      { kind: "workflow", label: L("Verification pipeline", "پایپ‌لاین اعتبارسنجی"), description: L("CI gates for tests, security and static checks.", "گیت‌های CI برای تست، امنیت و بررسی ایستا."), path: ".github/workflows/ci.yml" },
    ],
    scopeNote: L(
      "Source snapshot: public repository reviewed on 21 Nov 2026. Feature descriptions are backed by source and docs; no hosted demo, live benchmark or independent penetration-test result is claimed.",
      "منبع: ریپازیتوری عمومی بررسی‌شده در ۲۱ نوامبر ۲۰۲۶. قابلیت‌ها بر پایه کد و مستندات هستند؛ دموی آنلاین، بنچمارک زنده یا نتیجه تست نفوذ مستقل ادعا نشده است."
    ),
  },
  {
    slug: "psychology-atlas",
    projectName: "Psychology Atlas",
    repo: "psychology-atlas",
    sourceCommit: "e63c9063926bf4e72d5b2fa6a53e21cc5fad5327",
    category: L("Research-backed education / full-stack", "آموزش مستند و توسعه فول‌استک"),
    headline: L(
      "Build knowledge tools without inventing scientific certainty.",
      "ساخت ابزار دانشی، بدون ساختن قطعیت علمیِ خیالی."
    ),
    deck: L(
      "A Persian-first, RTL psychology learning platform connecting neuroscience references, assessment metadata and a knowledge graph, while preserving scientific provenance and rights boundaries.",
      "یک پلتفرم آموزشی روانشناسی با اولویت فارسی و راست‌چین، برای پیوند منابع علوم اعصاب، فراداده سنجش و گراف دانش؛ همراه با حفظ منشأ علمی و محدودیت‌های حقوق محتوا."
    ),
    challenge: L(
      "Educational psychology references may mix scientific claims, translated terms and instruments with different licensing restrictions. A searchable product has to distinguish reviewed evidence from incomplete data, and avoid turning learning materials into clinical advice.",
      "منابع آموزشی روانشناسی ممکن است ادعاهای علمی، ترجمه‌ها و ابزارهایی با مجوزهای متفاوت را با هم ترکیب کنند. یک محصول جست‌وجوپذیر باید داده بررسی‌شده را از داده ناقص جدا کند و محتوای آموزشی را به توصیه یا تشخیص بالینی تبدیل نکند."
    ),
    implementation: L(
      "The Next.js UI and Django API expose reviewed Brain and Assessment registries, exact instrument versions/language forms, scientific attribution and global search/graph connections. Controlled publication uses pinned research artifacts and repeat-safe audit checks. The educational product intentionally excludes questionnaire content, scoring and diagnosis.",
      "رابط Next.js و API جنگو، فهرست‌های بررسی‌شده مغز و ابزارهای سنجش، نسخه و فرم زبانی دقیق، ارجاع علمی و ارتباط با جست‌وجو و گراف دانش را ارائه می‌کنند. انتشار داده با فایل‌های قفل‌شده و ممیزی تکرارپذیر کنترل می‌شود. محتوای پرسش‌نامه، نمره‌گذاری و تشخیص عمداً خارج از محدوده‌اند."
    ),
    outcome: L(
      "The dated October 2026 audit records 87 reviewed anatomical entities, 70 sourced hierarchy links, and an Assessment registry with four instrument families and five versions. It documents browser checks, data constraints, test coverage and explicitly deferred features.",
      "ممیزی تاریخ‌دار اکتبر ۲۰۲۶، تعداد ۸۷ موجودیت آناتومی بررسی‌شده، ۷۰ ارتباط سلسله‌مراتبی مستند و فهرست سنجش با چهار خانواده ابزار و پنج نسخه را ثبت کرده است. همچنین آزمون‌های مرورگر، محدودیت داده و موارد موکول‌شده را مشخص کرده است."
    ),
    honestLimit: L(
      "This is educational software, not a diagnostic, treatment or scoring tool. The reviewed Brain hierarchy and Persian terminology are incomplete. The public source is viewable for evaluation, but the repository explicitly grants no general open-source license.",
      "این نرم‌افزار آموزشی است، نه ابزار تشخیص، درمان یا نمره‌گذاری. سلسله‌مراتب مغز و اصطلاحات فارسی هنوز کامل نیستند. کد برای بررسی عمومی قابل مشاهده است، ولی ریپازیتوری صراحتاً مجوز متن‌باز عمومی اعطا نمی‌کند."
    ),
    stats: [
      { value: "87", label: L("Reviewed anatomy entries", "موجودیت بررسی‌شده مغز"), detail: L("Dated v0.9.2C controlled selection", "انتخاب کنترل‌شده نسخه v0.9.2C") },
      { value: "70", label: L("Sourced hierarchy links", "پیوند سلسله‌مراتبی مستند"), detail: L("Recorded in v0.9 audit", "ثبت‌شده در ممیزی v0.9") },
      { value: "5", label: L("Assessment versions", "نسخه ابزار سنجش"), detail: L("Across four instrument families", "در چهار خانواده ابزار") },
    ],
    tech: ["Next.js", "Django", "DRF", "PostgreSQL", "SQLite", "Scientific provenance"],
    flow: [
      { name: L("Reviewed sources", "منابع بررسی‌شده"), role: L("Pinned citations and rights", "ارجاع و حقوق محتوای مشخص") },
      { name: L("Controlled publication", "انتشار کنترل‌شده"), role: L("Validation and safe re-application", "اعتبارسنجی و تکرار امن") },
      { name: L("Django API", "API جنگو"), role: L("Scoped educational registries", "فهرست‌های آموزشی محدوده‌دار") },
      { name: L("Search & graph", "جست‌وجو و گراف"), role: L("Canonical public identities", "هویت‌های مرجع عمومی") },
      { name: L("Persian-first UI", "رابط فارسی‌محور"), role: L("Evidence-aware browsing", "مرور همراه با منابع") },
    ],
    decisions: [
      {
        title: L("Provenance before completeness", "اصالت منبع پیش از کامل بودن"),
        choice: L("Publish only reviewed, source-resolved entries and keep missing scientific data explicitly missing.", "فقط رکوردهای بررسی‌شده با منبع روشن منتشر می‌شوند و داده علمی ناقص، ناقص باقی می‌ماند."),
        tradeoff: L("The public atlas grows more slowly, but incomplete evidence is not presented as settled scientific fact.", "پوشش اطلس کندتر گسترش می‌یابد، اما شواهد ناکافی به‌عنوان حقیقت قطعی نمایش داده نمی‌شوند."),
        source: "docs/Psychology_Atlas_v0.9_Final_Release_Audit_2026-10-09.md",
      },
      {
        title: L("Separate instruments and forms", "تفکیک ابزار و فرم"),
        choice: L("Keep assessment family, exact version, language form, study and access rights distinct.", "خانواده ابزار سنجش، نسخه دقیق، فرم زبانی، مطالعه و حق دسترسی جدا نگهداری می‌شوند."),
        tradeoff: L("The model is more complex, but prevents misleading mergers of study findings or permissions.", "مدل داده پیچیده‌تر است، ولی از ترکیب گمراه‌کننده نتایج مطالعات و مجوزها جلوگیری می‌کند."),
        source: "backend/atlas/tests_v095_integration.py",
      },
      {
        title: L("Do not cross the clinical boundary", "عبور نکردن از مرز بالینی"),
        choice: L("Expose educational metadata without protected questionnaires, scoring keys or diagnostic behavior.", "فراداده آموزشی بدون متن محافظت‌شده پرسش‌نامه، کلید نمره‌گذاری یا رفتار تشخیصی ارائه می‌شود."),
        tradeoff: L("Interactive clinical assessment is intentionally absent; users get a clearer, rights-aware learning tool.", "سنجش بالینی تعاملی عمداً وجود ندارد؛ در عوض ابزار آموزشی شفاف‌تر و سازگار با حقوق محتوا ارائه می‌شود."),
        source: "README.md",
      },
    ],
    evidence: [
      { kind: "audit", label: L("Dated v0.9 release audit", "ممیزی تاریخ‌دار نسخه v0.9"), description: L("Data counts, test gates, known limits and release scope.", "تعداد داده‌ها، گیت‌های تست، محدودیت‌ها و محدوده نسخه."), path: "docs/Psychology_Atlas_v0.9_Final_Release_Audit_2026-10-09.md" },
      { kind: "test", label: L("Global search integration tests", "تست یکپارچه جست‌وجو"), description: L("Scoped API and knowledge graph regression code.", "کد آزمون API و گراف دانش."), path: "backend/atlas/tests_v095_integration.py" },
      { kind: "architecture", label: L("Brain API implementation", "پیاده‌سازی API مغز"), description: L("Reviewed public anatomy resource endpoints.", "نقطه‌های دسترسی عمومی به آناتومی بررسی‌شده."), path: "backend/atlas/brain_views.py" },
      { kind: "rights", label: L("Third-party scientific attribution", "اعتبار و حقوق داده علمی"), description: L("Brain data licenses and reuse boundaries.", "مجوزهای داده مغز و محدوده بازاستفاده."), path: "docs/research/brain/v0.9.2c/THIRD_PARTY_NOTICES.md" },
      { kind: "workflow", label: L("Project CI pipeline", "پایپ‌لاین CI"), description: L("Backend, PostgreSQL, frontend and browser verification jobs.", "بررسی بک‌اند، PostgreSQL، فرانت‌اند و مرورگر."), path: ".github/workflows/ci.yml" },
    ],
    scopeNote: L(
      "Numbers are from the 9 Oct 2026 release audit, not a live database query. Public repository visibility is not an open-source grant; this is educational, non-diagnostic work.",
      "اعداد مربوط به ممیزی ۹ اکتبر ۲۰۲۶ هستند و از پایگاه داده زنده استخراج نشده‌اند. عمومی بودن ریپازیتوری مجوز متن‌باز نیست؛ محصول آموزشی و غیرتشخیصی است."
    ),
  },
];

export function caseStudyForSlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((item) => item.slug === slug);
}

export function caseStudyUrl(slug: string): string {
  return "/case-studies/" + slug + "/";
}

export function evidenceUrl(study: CaseStudy, path: string): string {
  return "https://github.com/dibbed/" + study.repo + "/blob/" + study.sourceCommit + "/" + path;
}
