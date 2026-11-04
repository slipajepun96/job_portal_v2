import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Keep only digits and a single decimal point (max 2 decimal places), e.g. "1,500.505" -> "1500.50"
export function sanitizeCurrency(value) {
  const [whole, ...rest] = String(value ?? '').replace(/[^\d.]/g, '').split('.');
  return rest.length ? `${whole}.${rest.join('').slice(0, 2)}` : whole;
}
