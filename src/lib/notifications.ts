import { sendEmail } from "./email";

export async function sendWelcomeEmail(email: string, name?: string) {
  await sendEmail({
    to: [{ email, name }],
    subject: "Welcome to VGMF Portal",
    htmlBody: `<h2>Welcome, ${name || "User"}!</h2><p>Your account is ready.</p>`,
  });
}

export async function sendOrderConfirmation(email: string, orderNumber: string, amount: number) {
  await sendEmail({
    to: [{ email }],
    subject: `Order Confirmed - ${orderNumber}`,
    htmlBody: `<h2>Order Confirmed!</h2><p>Order: ${orderNumber}</p><p>Amount: ₹${amount}</p>`,
  });
}

export async function sendRegistrationConfirmation(email: string, type: string, refNumber: string) {
  await sendEmail({
    to: [{ email }],
    subject: `${type} Registration Confirmed`,
    htmlBody: `<h2>Registration Confirmed!</h2><p>${type}: ${refNumber}</p>`,
  });
}

export async function sendApplicationStatusUpdate(email: string, trackingNumber: string, status: string) {
  await sendEmail({
    to: [{ email }],
    subject: `Fellowship Application Update - ${trackingNumber}`,
    htmlBody: `<h2>Application Status: ${status}</h2><p>Tracking: ${trackingNumber}</p>`,
  });
}
