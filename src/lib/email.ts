import { getEmailSettings } from "./settings";

const ZEPTO_API = "https://api.zeptomail.in/v1.1/email";

interface EmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlBody: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions) {
  const { apiKey: ZEPTO_KEY, fromAddress: defaultFrom } = await getEmailSettings();
  if (!ZEPTO_KEY) { console.log("ZeptoMail not configured, skipping email"); return; }
  try {
    await fetch(ZEPTO_API, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Zoho-enczapikey ${ZEPTO_KEY}`,
      },
      body: JSON.stringify({
        from: { address: options.from || defaultFrom, name: "VGMF Portal" },
        to: options.to.map(t => ({ email_address: { address: t.email, name: t.name || t.email } })),
        subject: options.subject,
        htmlbody: options.htmlBody,
      }),
    });
  } catch (e) { console.error("Email send failed:", e); }
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
