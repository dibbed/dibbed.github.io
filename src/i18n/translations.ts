export type Lang = "en" | "fa";

export const translations = {
  nav: {
    home: { en: "Home", fa: "خانه" },
    skills: { en: "Skills", fa: "مهارت‌ها" },
    experience: { en: "Experience", fa: "تجربه" },
    projects: { en: "Projects", fa: "پروژه‌ها" },
    education: { en: "Education", fa: "تحصیلات" },
    contact: { en: "Contact", fa: "تماس" },
  },
  hero: {
    badge: { en: "// BACKEND & AUTOMATION", fa: "// بک‌اند و اتوماسیون" },
    subtitle: {
      en: "Python backend, developer automation and systems tooling. Building useful software at the intersection of engineering and learning.",
      fa: "توسعه بک‌اند پایتون، اتوماسیون و ابزارهای سیستمی، با علاقه به پیوند مهندسی نرم‌افزار و یادگیری.",
    },
    downloadCv: { en: "Download CV", fa: "دانلود رزومه" },
    scroll: { en: "Scroll", fa: "اسکرول" },
  },
  sections: {
    technicalSkills: { en: "Technical Skills", fa: "مهارت‌های فنی" },
    experience: { en: "Experience", fa: "تجربه کاری" },
    projects: { en: "Projects", fa: "پروژه‌ها" },
    education: { en: "Education", fa: "تحصیلات" },
    getInTouch: { en: "Get in Touch", fa: "ارتباط با من" },
  },
  activity: {
    header: { en: "[SYSTEM_LOG] Activity", fa: "[SYSTEM_LOG] فعالیت" },
    scanning: { en: "Scanning network...", fa: "اسکن شبکه..." },
  },
  contact: {
    available: { en: "● Open to collaboration", fa: "● آماده همکاری و گفت‌وگوی فنی" },
    languages: {
      en: "Persian (Native) · English (Technical)",
      fa: "فارسی (زبان مادری) · انگلیسی فنی",
    },
    copyright: {
      en: (y: number) => `© ${y} Ali Khalili. Built with React & Tailwind.`,
      fa: (y: number) => `© ${y} علی خلیلی. ساخته شده با React و Tailwind.`,
    },
  },
  architecture: {
    viewArchitecture: { en: "View Architecture →", fa: "مشاهده معماری →" },
    systemArchitecture: { en: "System Architecture", fa: "معماری سیستم" },
  },
  achievements: {
    "Public Repositories": { en: "Public Repos", fa: "مخزن عمومی" },
    "Supported OS Targets": { en: "OS Targets", fa: "سیستم‌عامل" },
    "Chemistry Elements": { en: "Elements", fa: "عنصر شیمیایی" },
    "Featured Projects": { en: "Featured Projects", fa: "پروژه منتخب" },
    } as Record<string, { en: string; fa: string }>,
} as const;
