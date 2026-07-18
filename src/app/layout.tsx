import type { Metadata } from "next";
import { DM_Sans, Baloo_2 } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700"] });
const baloo2 = Baloo_2({ subsets: ["latin"], variable: "--font-heading", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: "Vaidya Gogate Memorial Foundation", template: "%s - VGMF" },
  description: "VGMF - Preserving Ayurvedic heritage through research, education, and community service since 1972.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${baloo2.variable} font-body bg-cream text-ink antialiased`}>
        <SessionProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontFamily: "var(--font-body)", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.875rem" },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
