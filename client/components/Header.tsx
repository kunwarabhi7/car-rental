"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DarkMode } from "@/components/DarkMode";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const fetchUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.user;
};

export default function Header() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border-b border-gray-200/20 dark:border-gray-700/20">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent animate-fade-in"
        >
          CarRental
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 items-center">
          <Link
            href="/"
            className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 animate-fade-in"
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                href="/profile"
                className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 animate-fade-in"
              >
                Profile
              </Link>
              <Button
                variant="outline"
                className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-[1.02] font-medium"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/auth/login";
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 animate-fade-in"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 animate-fade-in"
              >
                Register
              </Link>
            </>
          )}
          <DarkMode />
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none transition-transform duration-200 hover:scale-[1.02]"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden bg-white/70 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 backdrop-blur-xl border-t border-gray-200/20 dark:border-gray-700/20 p-6 space-y-4 animate-slide-down">
          <Link
            href="/"
            className="block text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 animate-fade-in"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                href="/profile"
                className="block text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 animate-fade-in"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <Button
                variant="outline"
                className="w-full border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-[1.02] font-medium"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/auth/login";
                  setOpen(false);
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 animate-fade-in"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="block text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors duration-200 animate-fade-in"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          )}
          <DarkMode />
        </div>
      )}
    </header>
  );
}
