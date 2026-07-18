import { prisma } from "./prisma";

let cache: Record<string, string> | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

export async function getSiteSettings(): Promise<Record<string, string>> {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL) return cache;
  try {
    const items = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    items.forEach((item) => {
      map[item.key] = item.value;
    });
    cache = map;
    cacheTime = now;
    return map;
  } catch {
    return cache || {};
  }
}

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const settings = await getSiteSettings();
  return settings[key] || fallback;
}

export async function getRazorpayKeys(): Promise<{ keyId: string; keySecret: string; testMode: boolean }> {
  const settings = await getSiteSettings();
  const testMode = settings["payment.razorpayTestMode"] === "true";
  const keyId = testMode
    ? settings["payment.razorpayTestKeyId"] || process.env.RAZORPAY_TEST_KEY_ID || ""
    : settings["payment.razorpayKeyId"] || process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  const keySecret = testMode
    ? settings["payment.razorpayTestSecret"] || process.env.RAZORPAY_TEST_KEY_SECRET || ""
    : settings["payment.razorpayKeySecret"] || process.env.RAZORPAY_KEY_SECRET || "";
  return { keyId, keySecret, testMode };
}

export async function getEmailSettings(): Promise<{ apiKey: string; fromAddress: string }> {
  const settings = await getSiteSettings();
  return {
    apiKey: settings["email.zeptoApiKey"] || process.env.ZEPTOMAIL_API_KEY || "",
    fromAddress: settings["email.fromAddress"] || process.env.FROM_EMAIL || "noreply@vaidyagogate.org",
  };
}

export async function getBrandingSettings(): Promise<{ logoUrl: string; faviconUrl: string }> {
  const settings = await getSiteSettings();
  return {
    logoUrl: settings["branding.logoUrl"] || "",
    faviconUrl: settings["branding.faviconUrl"] || "",
  };
}

export function clearSettingsCache() {
  cache = null;
  cacheTime = 0;
}
