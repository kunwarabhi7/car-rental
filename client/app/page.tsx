"use client";

import CarList from "@/components/CarList";
import HeroSection from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-orange-50 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
      <HeroSection />
      <CarList />
    </div>
  );
}
