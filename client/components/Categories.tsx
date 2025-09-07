"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Categories() {
  const router = useRouter();
  const categories = [
    { name: "All Types", value: "all" },
    { name: "Sedan", value: "sedan" },
    { name: "SUV", value: "suv" },
    { name: "Luxury", value: "luxury" },
    { name: "Hatchback", value: "hatchback" },
  ];

  const handleCategoryClick = (type: string) => {
    router.push(`/cars?type=${type}`);
  };

  return (
    <section className="container mx-auto py-12">
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 animate-fade-in">
        Browse by Category
      </h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map((category) => (
          <Button
            key={category.value}
            className="category-button"
            onClick={() => handleCategoryClick(category.value)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </section>
  );
}
