import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Base path of the app ("" for root deployments like dibbed.github.io). */
export function getBasePath(baseUrl: string = import.meta.env?.BASE_URL ?? "/"): string {
  if (!baseUrl || baseUrl === "/" || baseUrl === "./" || baseUrl === ".") {
    return "";
  }
  const normalized = baseUrl.startsWith("/") ? baseUrl : `/${baseUrl}`;
  return normalized.replace(/\/+$/, "");
}

/** Full URL for resume.pdf on the current site regardless of active route. */
export function getResumeUrl(baseUrl?: string): string {
  const base = getBasePath(baseUrl);
  if (typeof window === "undefined") {
    return `${base}/resume.pdf`;
  }
  return `${window.location.origin}${base}/resume.pdf`;
}
