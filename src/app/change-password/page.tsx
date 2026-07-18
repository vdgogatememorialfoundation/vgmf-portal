"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ChangePasswordPanel from "@/components/ChangePasswordPanel";
import { Loader2 } from "lucide-react";

export default function ChangePasswordPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 size={28} className="text-teal animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <ChangePasswordPanel />
      </div>
    </div>
  );
}
