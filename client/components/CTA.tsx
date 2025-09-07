"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

export default function CTA() {
  const { user } = useAuth();

  return (
    <section className="container mx-auto py-16 text-center">
      <div className="card-glass p-8 max-w-lg mx-auto animate-fade-in">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4 animate-fade-in">
          Ready to Hit the Road?
        </h2>
        <p className="text-[var(--muted-foreground)] mb-6">
          {user
            ? "Book your next car now!"
            : "Sign up today to explore our exclusive car rentals!"}
        </p>
        <Button asChild className="button-primary">
          <Link href={user ? "/cars" : "/auth/register"}>
            {user ? "Browse Cars" : "Get Started"}
          </Link>
        </Button>
      </div>
    </section>
  );
}
