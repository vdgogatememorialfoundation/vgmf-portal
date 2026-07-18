"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
import NoticeAnnouncementBar from "./NoticeAnnouncementBar";

const HIDE_NAV_FOOTER = ["/admin", "/staff", "/dashboard", "/judge", "/scanner", "/doctor", "/trustee", "/reviewer"];

export function LayoutWrapper({
  children,
  logoUrl,
  faviconUrl,
}: {
  children: React.ReactNode;
  logoUrl?: string;
  faviconUrl?: string;
}) {
  const pathname = usePathname();
  const hideNavFooter = HIDE_NAV_FOOTER.some(p => pathname.startsWith(p));

  if (hideNavFooter) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar logoUrl={logoUrl} />
      <NoticeAnnouncementBar />
      <main className="min-h-screen bg-[#faf9f6]">{children}</main>
      <Footer />
      <Chatbot />
    </>
  );
}
