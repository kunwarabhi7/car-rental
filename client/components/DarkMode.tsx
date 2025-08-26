"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DarkMode() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative border-blue-900 dark:border-gray-600 text-blue-900 dark:text-white hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-all duration-200 hover:scale-up rounded-full"
        >
          <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg animate-fade-in"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="text-gray-900 dark:text-white hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-colors duration-200"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="text-gray-900 dark:text-white hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-colors duration-200"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="text-gray-900 dark:text-white hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white transition-colors duration-200"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
