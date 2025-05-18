"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  // Get initial theme from localStorage or default to light
  const initialTheme = typeof window !== 'undefined' 
    ? localStorage.getItem('theme') || 'light'
    : 'light';

  // Ensure we always have a string value
  const themeValue = initialTheme || 'light';

  // Use a state variable to track the current theme
  const [currentTheme, setCurrentTheme] = useState<string>(themeValue);

  // Update currentTheme when theme changes
  useEffect(() => {
    setCurrentTheme(theme || 'light');
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all ${currentTheme === "dark" ? "-rotate-90 scale-0" : ""}`} />
          <Moon className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all ${currentTheme === "dark" ? "rotate-0 scale-100" : ""}`} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => {
          setTheme("light");
          setCurrentTheme("light");
        }}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          setTheme("dark");
          setCurrentTheme("dark");
        }}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          setTheme("system");
          setCurrentTheme("system");
        }}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
