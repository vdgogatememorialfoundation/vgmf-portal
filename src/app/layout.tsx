import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-body" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: { default: "Vaidya Gogate Memorial Foundation", template: "%s - VGMF" },
  description: "VGMF - Advancing Ayurveda Since 1972.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${playfair.variable} font-body bg-cream text-ink antialiased`}>
        <SessionProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
