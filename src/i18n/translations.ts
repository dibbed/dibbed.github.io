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
    badge: { en: "// SENIOR BACKEND ENGINEER", fa: "// مهندس ارشد بک‌اند" },
    subtitle: {
      en: "Senior Python Backend Engineer — High-Performance Distributed Systems & AI/ML Infrastructure",
      fa: "مهندس ارشد بک‌اند پایتون — سیستم‌های توزیع‌شده با کارایی بالا و زیرساخت هوش مصنوعی",
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
    available: { en: "● Available for Remote / Relocation", fa: "● آماده کار ریموت / مهاجرت" },
    languages: {
      en: "Persian (Native) · English (Professional)",
      fa: "فارسی (بومی) · انگلیسی (حرفه‌ای)",
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
    "Users Served": { en: "Users Served", fa: "کاربران" },
    "Requests/Second": { en: "Requests/Second", fa: "درخواست/ثانیه" },
    "Avg Response": { en: "Avg Response", fa: "میانگین پاسخ" },
    "System Uptime": { en: "System Uptime", fa: "آپتایم سیستم" },
    "Setup Reduction": { en: "Setup Reduction", fa: "کاهش نصب" },
    "Production Systems": { en: "Production Systems", fa: "سیستم‌های تولیدی" },
  } as Record<string, { en: string; fa: string }>,
} as const;
