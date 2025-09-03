"use client";

import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function PublicRoute({ children }: { children: ReactNode }) {
  const { user, userLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && user) {
      router.push("/profile");
    }
  }, [user, userLoading, router]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-orange-50 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (user) {
    return null; // Redirect handled by useEffect
  }

  return <>{children}</>;
}
