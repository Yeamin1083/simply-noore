import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export function assetPath(path: string): string {
  const isProd = process.env.NODE_ENV === "production";
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? (isProd ? "/simply-noore" : "");
  if (!path) return base || "/";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
