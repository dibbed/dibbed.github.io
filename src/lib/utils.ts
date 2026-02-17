import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Base path of the app (e.g. "" or "/newreadmetest") for current origin. */
export function getBasePath(): string {
  if (typeof window === "undefined") return "";
  const segs = window.location.pathname.replace(/\/$/, "").split("/").filter(Boolean);
  return segs.length ? `/${segs[0]}` : "";
}

/** Full URL for resume.pdf on the current site (works on any deploy/subpath). */
export function getResumeUrl(): string {
  if (typeof window === "undefined") return "./resume.pdf";
  const base = getBasePath();
  return `${window.location.origin}${base}/resume.pdf`;
}
