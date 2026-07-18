"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "./Chatbot";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isStaff = pathname.startsWith("/staff");

  if (isAdmin || isStaff) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#faf9f6]">{children}</main>
      <Footer />
      <Chatbot />
    </>
  );
}
