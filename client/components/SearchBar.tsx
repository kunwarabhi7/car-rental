"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const cars = [
  { id: "1", name: "Toyota Camry", type: "new" },
  { id: "2", name: "BMW X5", type: "used" },
  { id: "3", name: "Tesla Model 3", type: "new" },
  { id: "4", name: "Honda City", type: "used" },
];

export default function CarSearchDropdown() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filteredCars = cars.filter((car) => {
    const matchesQuery = car.name.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "all" ? true : car.type === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="flex items-center gap-3">
      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[100px] capitalize">
            {filter}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setFilter("all")}>
            All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilter("new")}>
            New
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilter("used")}>
            Used
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search Input */}
      <div className="relative w-64">
        <Input
          placeholder="Search car..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Result dropdown suggestion */}
        {query && (
          <div className="absolute mt-1 w-full bg-white dark:bg-gray-900 border rounded-md shadow-lg z-50">
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <Link
                  key={car.id}
                  href={`/cars/${car.id}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {car.name} ({car.type})
                </Link>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
