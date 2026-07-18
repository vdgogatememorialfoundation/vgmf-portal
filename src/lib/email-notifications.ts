import { sendEmail } from "@/lib/email";

const BASE_URL = process.env.NEXTAUTH_URL || "https://staging.vaidyagogate.org";
const BRAND_COLOR = "#0d6662";
const BRAND_LIGHT = "#f0fdfa";
const BG_COLOR = "#faf9f6";
const TEXT_COLOR = "#333333";
const TEXT_MUTED = "#666666";

function emailWrapper(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:${BG_COLOR};font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_COLOR};padding:40px 20px;">
        <tr><td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <tr>
              <td style="background-color:${BRAND_COLOR};padding:28px 32px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">VGMF</h1>
                <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:12px;letter-spacing:1px;text-transform:uppercase;">Vaidya Go Medical Foundation</p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px;color:${TEXT_COLOR};font-size:15px;line-height:1.7;">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #eee;text-align:center;color:${TEXT_MUTED};font-size:12px;line-height:1.6;">
                <p style="margin:0;">Vaidya Go Medical Foundation &copy; ${new Date().getFullYear()}</p>
                <p style="margin:4px 0 0;">Empowering communities through healthcare &amp; education</p>
                <p style="margin:8px 0 0;">
                  <a href="${BASE_URL}" style="color:${BRAND_COLOR};text-decoration:none;">Website</a>
                  &nbsp;&bull;&nbsp;
                  <a href="mailto:support@vaidyagogate.org" style="color:${BRAND_COLOR};text-decoration:none;">Support</a>
                </p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>`;
}

function buttonHtml(label: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;padding:12px 28px;background-color:${BRAND_COLOR};color:#ffffff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;margin:16px 0;">${label}</a>`;
}

export async function sendWelcomeEmail(user: { name?: string | null; email: string }) {
  const name = user.name || "there";
  const html = emailWrapper(`
    <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;">Welcome to VGMF, ${name}!</h2>
    <p style="margin:0 0 12px;">Your account has been created successfully. You can now access all VGMF services including:</p>
    <ul style="margin:0 0 16px;padding-left:20px;color:${TEXT_MUTED};">
      <li>Register for seminars and workshops</li>
      <li>Apply for fellowships and programmes</li>
      <li>Track your applications and certificates</li>
    </ul>
    ${buttonHtml("Go to Dashboard", `${BASE_URL}/dashboard`)}
    <p style="margin:16px 0 0;color:${TEXT_MUTED};font-size:13px;">If you have any questions, feel free to reach out to our support team.</p>
  `);

  await sendEmail({
    to: [{ email: user.email, name }],
    subject: "Welcome to VGMF Portal!",
    htmlBody: html,
  });
}

export async function sendOtpEmail(
  email: string,
  name: string | null | undefined,
  code: string,
  purpose: "signup" | "login" | "reset"
) {
  const displayName = name || "there";
  const headings: Record<string, { title: string; line1: string }> = {
    signup: {
      title: "Verify Your Email Address",
      line1: "Use the code below to complete your registration.",
    },
    login: {
      title: "Your Login Verification Code",
      line1: "Use the code below to sign in to your account.",
    },
    reset: {
      title: "Password Reset Code",
      line1: "Use the code below to reset your password.",
    },
  };

  const { title, line1 } = headings[purpose];

  const html = emailWrapper(`
    <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;">${title}</h2>
    <p style="margin:0 0 12px;">Hi ${displayName},</p>
    <p style="margin:0 0 20px;">${line1}</p>
    <div style="text-align:center;margin:24px 0;">
      <span style="display:inline-block;font-size:36px;font-weight:700;letter-spacing:8px;color:${BRAND_COLOR};background-color:${BRAND_LIGHT};padding:18px 28px;border-radius:10px;font-family:'Courier New',monospace;">${code}</span>
    </div>
    <p style="margin:0 0 8px;color:${TEXT_MUTED};font-size:13px;">This code expires in <strong>10 minutes</strong>.</p>
    <p style="margin:0;color:${TEXT_MUTED};font-size:13px;">If you didn&apos;t request this, please ignore this email.</p>
  `);

  await sendEmail({
    to: [{ email, name: displayName }],
    subject: `Your VGMF Verification Code: ${code}`,
    htmlBody: html,
  });
}

export async function sendEventRegistrationConfirmation(
  user: { name?: string | null; email: string },
  event: { title: string; date?: string | Date | null; venue?: string | null },
  registration: { id: string; registrationNumber?: string | null }
) {
  const name = user.name || "there";
  const eventDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "Date TBA";

  const html = emailWrapper(`
    <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;">Registration Confirmed!</h2>
    <p style="margin:0 0 12px;">Hi ${name},</p>
    <p style="margin:0 0 20px;">You have been successfully registered for the following event:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_LIGHT};border-radius:8px;padding:20px;margin:16px 0;">
      <tr><td>
        <p style="margin:0 0 8px;font-size:17px;font-weight:700;color:${BRAND_COLOR};">${event.title}</p>
        <p style="margin:0 0 4px;color:${TEXT_MUTED};font-size:14px;">${eventDate}</p>
        ${event.venue ? `<p style="margin:0;color:${TEXT_MUTED};font-size:14px;">${event.venue}</p>` : ""}
        ${registration.registrationNumber ? `<p style="margin:10px 0 0;font-size:13px;color:${TEXT_COLOR};">Registration #: <strong>${registration.registrationNumber}</strong></p>` : ""}
      </td></tr>
    </table>
    ${buttonHtml("View Registration", `${BASE_URL}/dashboard`)}
  `);

  await sendEmail({
    to: [{ email: user.email, name }],
    subject: `Registration Confirmed - ${event.title}`,
    htmlBody: html,
  });
}

export async function sendEventCancellationConfirmation(
  user: { name?: string | null; email: string },
  event: { title: string },
  registration: { id: string }
) {
  const name = user.name || "there";

  const html = emailWrapper(`
    <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;">Registration Cancelled</h2>
    <p style="margin:0 0 12px;">Hi ${name},</p>
    <p style="margin:0 0 20px;">Your registration for <strong>${event.title}</strong> has been successfully cancelled.</p>
    <p style="margin:0 0 16px;color:${TEXT_MUTED};font-size:14px;">If you believe this was done in error, please contact our support team.</p>
    ${buttonHtml("Contact Support", `${BASE_URL}/dashboard`)}
  `);

  await sendEmail({
    to: [{ email: user.email, name }],
    subject: `Registration Cancelled - ${event.title}`,
    htmlBody: html,
  });
}

export async function sendPaymentConfirmation(
  user: { name?: string | null; email: string },
  order: { id: string; amount: number; currency?: string; createdAt?: string | Date },
  event?: { title: string } | null
) {
  const name = user.name || "there";
  const amount = `${order.currency || "INR"} ${order.amount.toFixed(2)}`;
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  const html = emailWrapper(`
    <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;">Payment Confirmation</h2>
    <p style="margin:0 0 12px;">Hi ${name},</p>
    <p style="margin:0 0 20px;">We have received your payment. Here are the details:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_LIGHT};border-radius:8px;padding:20px;margin:16px 0;">
      <tr><td>
        <p style="margin:0 0 8px;font-size:15px;color:${TEXT_COLOR};">Amount: <strong style="color:${BRAND_COLOR};font-size:18px;">${amount}</strong></p>
        <p style="margin:0 0 4px;font-size:14px;color:${TEXT_MUTED};">Order ID: ${order.id}</p>
        <p style="margin:0 0 4px;font-size:14px;color:${TEXT_MUTED};">Date: ${orderDate}</p>
        ${event ? `<p style="margin:0;font-size:14px;color:${TEXT_MUTED};">Event: ${event.title}</p>` : ""}
      </td></tr>
    </table>
    <p style="margin:0;color:${TEXT_MUTED};font-size:13px;">A receipt has been attached for your records. Thank you for your support!</p>
  `);

  await sendEmail({
    to: [{ email: user.email, name }],
    subject: `Payment Confirmation - ${amount}`,
    htmlBody: html,
  });
}

export async function sendCertificateIssued(
  user: { name?: string | null; email: string },
  certificate: { id: string; title: string; issuedAt?: string | Date | null; certificateNumber?: string | null }
) {
  const name = user.name || "there";
  const issuedDate = certificate.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  const html = emailWrapper(`
    <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;">Certificate Issued</h2>
    <p style="margin:0 0 12px;">Hi ${name},</p>
    <p style="margin:0 0 20px;">Congratulations! Your certificate has been issued and is ready to download.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_LIGHT};border-radius:8px;padding:20px;margin:16px 0;">
      <tr><td>
        <p style="margin:0 0 8px;font-size:17px;font-weight:700;color:${BRAND_COLOR};">${certificate.title}</p>
        <p style="margin:0 0 4px;font-size:14px;color:${TEXT_MUTED};">Issued: ${issuedDate}</p>
        ${certificate.certificateNumber ? `<p style="margin:0;font-size:13px;color:${TEXT_MUTED};">Certificate #: ${certificate.certificateNumber}</p>` : ""}
      </td></tr>
    </table>
    ${buttonHtml("Download Certificate", `${BASE_URL}/dashboard/certificates`)}
  `);

  await sendEmail({
    to: [{ email: user.email, name }],
    subject: `Certificate Issued - ${certificate.title}`,
    htmlBody: html,
  });
}

export async function sendETicket(
  user: { name?: string | null; email: string },
  registration: { id: string; registrationNumber?: string | null },
  event: { title: string; date?: string | Date | null; venue?: string | null }
) {
  const name = user.name || "there";
  const eventDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "Date TBA";

  const html = emailWrapper(`
    <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;">Your E-Ticket</h2>
    <p style="margin:0 0 12px;">Hi ${name},</p>
    <p style="margin:0 0 20px;">Here is your e-ticket for the upcoming event. Please present this at the venue entrance.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_LIGHT};border:2px dashed ${BRAND_COLOR};border-radius:12px;padding:24px;margin:16px 0;">
      <tr><td>
        <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${TEXT_MUTED};">Event</p>
        <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:${BRAND_COLOR};">${event.title}</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:0 12px 12px 0;vertical-align:top;">
              <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${TEXT_MUTED};">Date</p>
              <p style="margin:2px 0 0;font-size:14px;color:${TEXT_COLOR};">${eventDate}</p>
            </td>
            <td style="padding:0 0 12px;vertical-align:top;">
              <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${TEXT_MUTED};">Venue</p>
              <p style="margin:2px 0 0;font-size:14px;color:${TEXT_COLOR};">${event.venue || "TBA"}</p>
            </td>
          </tr>
        </table>
        ${registration.registrationNumber ? `
        <p style="margin:12px 0 0;padding-top:12px;border-top:1px dashed #ccc;font-size:13px;color:${TEXT_MUTED};">
          Registration #: <strong style="color:${TEXT_COLOR};">${registration.registrationNumber}</strong>
        </p>` : ""}
      </td></tr>
    </table>
    ${buttonHtml("View Event Details", `${BASE_URL}/dashboard`)}
  `);

  await sendEmail({
    to: [{ email: user.email, name }],
    subject: `E-Ticket - ${event.title}`,
    htmlBody: html,
  });
}

export async function sendStatusChange(
  user: { name?: string | null; email: string },
  type: "application" | "registration" | "fellowship" | "certificate" | "payment",
  newStatus: string,
  details?: { title?: string; id?: string; message?: string }
) {
  const name = user.name || "there";
  const statusColors: Record<string, string> = {
    approved: "#16a34a",
    confirmed: "#16a34a",
    completed: "#16a34a",
    active: "#16a34a",
    rejected: "#dc2626",
    cancelled: "#dc2626",
    failed: "#dc2626",
    pending: "#ca8a04",
    under_review: "#ca8a04",
    processing: "#ca8a04",
  };
  const statusColor = statusColors[newStatus.toLowerCase()] || BRAND_COLOR;

  const titleMap: Record<string, string> = {
    application: "Application",
    registration: "Registration",
    fellowship: "Fellowship",
    certificate: "Certificate",
    payment: "Payment",
  };

  const html = emailWrapper(`
    <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;">Status Update</h2>
    <p style="margin:0 0 12px;">Hi ${name},</p>
    <p style="margin:0 0 20px;">Your <strong>${titleMap[type] || type}</strong> status has been updated.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_LIGHT};border-radius:8px;padding:20px;margin:16px 0;">
      <tr><td>
        ${details?.title ? `<p style="margin:0 0 8px;font-size:16px;font-weight:700;color:${TEXT_COLOR};">${details.title}</p>` : ""}
        <p style="margin:0 0 12px;">
          <span style="display:inline-block;padding:4px 12px;background-color:${statusColor};color:#ffffff;border-radius:20px;font-size:13px;font-weight:600;text-transform:capitalize;">${newStatus.replace(/_/g, " ")}</span>
        </p>
        ${details?.message ? `<p style="margin:0;color:${TEXT_MUTED};font-size:14px;line-height:1.6;">${details.message}</p>` : ""}
      </td></tr>
    </table>
    ${buttonHtml("View Details", `${BASE_URL}/dashboard`)}
  `);

  await sendEmail({
    to: [{ email: user.email, name }],
    subject: `${titleMap[type] || type} Status Updated - ${newStatus.replace(/_/g, " ")}`,
    htmlBody: html,
  });
}

export async function sendAdminNotification(subject: string, body: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@vaidyagogate.org";

  const html = emailWrapper(`
    <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;">Admin Notification</h2>
    <p style="margin:0 0 16px;font-weight:600;color:${TEXT_COLOR};font-size:16px;">${subject}</p>
    <div style="background-color:${BRAND_LIGHT};border-radius:8px;padding:20px;margin:16px 0;">
      <p style="margin:0;color:${TEXT_COLOR};font-size:14px;line-height:1.7;white-space:pre-wrap;">${body}</p>
    </div>
    ${buttonHtml("Go to Admin Panel", `${BASE_URL}/admin`)}
  `);

  await sendEmail({
    to: [{ email: adminEmail, name: "VGMF Admin" }],
    subject: `[VGMF Admin] ${subject}`,
    htmlBody: html,
  });
}

export async function sendAdminCreatedAccountEmail(
  user: { name?: string | null; email: string; role?: string },
  plainPassword: string
) {
  const displayName = user.name || "there";
  const roleDisplay = user.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : "User";
  const loginUrl = `${BASE_URL}/login`;

  const html = emailWrapper(`
    <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;">Your VGMF Account Has Been Created</h2>
    <p style="margin:0 0 12px;">Dear ${displayName},</p>
    <p style="margin:0 0 20px;">Your VGMF account has been created by an administrator. Please find your login credentials below:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_LIGHT};border-radius:8px;padding:24px;margin:16px 0;">
      <tr><td>
        <p style="margin:0 0 12px;font-size:14px;color:${TEXT_MUTED};">Account Type: <strong style="color:${BRAND_COLOR};">${roleDisplay}</strong></p>
        <p style="margin:0 0 12px;font-size:14px;color:${TEXT_MUTED};">Email: <strong style="color:${TEXT_COLOR};">${user.email}</strong></p>
        <p style="margin:0;font-size:14px;color:${TEXT_MUTED};">Password: <strong style="color:${TEXT_COLOR};font-family:monospace;font-size:16px;background:#fff;padding:4px 10px;border-radius:4px;border:1px solid #e5e7eb;">${plainPassword}</strong></p>
      </td></tr>
    </table>
    <p style="margin:0 0 16px;color:${TEXT_MUTED};font-size:14px;"><strong>Important:</strong> Please change your password after your first login for security.</p>
    ${buttonHtml("Sign In to Your Account", loginUrl)}
  `);

  await sendEmail({
    to: [{ email: user.email, name: displayName }],
    subject: "Your VGMF Account Created - Sign In Details Inside",
    htmlBody: html,
  });
}

export async function sendPasswordChangedEmail(
  user: { id?: string; name?: string | null; email?: string },
  newPassword: string
) {
  if (!user.email) return;
  const displayName = user.name || "there";
  const loginUrl = `${BASE_URL}/login`;

  const html = emailWrapper(`
    <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;">Password Changed</h2>
    <p style="margin:0 0 12px;">Hi ${displayName},</p>
    <p style="margin:0 0 20px;">Your VGMF account password has been changed by an administrator.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_LIGHT};border-radius:8px;padding:20px;margin:16px 0;">
      <tr><td>
        <p style="margin:0 0 8px;font-size:14px;color:${TEXT_MUTED};">New Password:</p>
        <p style="margin:0;font-size:16px;font-family:monospace;color:${TEXT_COLOR};background:#fff;padding:8px 14px;border-radius:6px;border:1px solid #e5e7eb;display:inline-block;">${newPassword}</p>
      </td></tr>
    </table>
    ${buttonHtml("Sign In", loginUrl)}
  `);

  await sendEmail({
    to: [{ email: user.email, name: displayName }],
    subject: "Your VGMF Password Has Been Changed",
    htmlBody: html,
  });
}
