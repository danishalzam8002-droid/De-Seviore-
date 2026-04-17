import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function optimizeCloudinary(url: string | undefined, width = 800) {
  if (!url) return "";
  if (!url.includes("cloudinary.com")) return url;
  
  if (url.includes("/upload/")) {
    const parts = url.split("/upload/");
    // Add q_auto, f_auto and width transformation
    return `${parts[0]}/upload/q_auto,f_auto,w_${width}/${parts[1]}`;
  }
  
  return url;
}
