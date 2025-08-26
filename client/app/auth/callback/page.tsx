"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error(decodeURIComponent(error));
      router.push("/auth/login");
    } else if (token) {
      localStorage.setItem("token", token);
      toast.success("Google login successful!");
      router.push("/profile");
    }
  }, [searchParams, router]);

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold text-blue-900">Authenticating...</h1>
    </div>
  );
}
