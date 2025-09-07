"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="py-20 text-center">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight animate-fade-in bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
          Rent Your Dream Car
        </h1>
        <p className="text-lg md:text-xl mt-6 text-gray-600 dark:text-gray-300 animate-fade-in max-w-2xl mx-auto">
          Discover our premium fleet and drive in style. Book your ride today!
        </p>
        <Button
          asChild
          className="mt-8 px-10 py-2 bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02]"
        >
          <Link href="/cars">Browse Cars</Link>
        </Button>
      </div>
    </section>
  );
}
