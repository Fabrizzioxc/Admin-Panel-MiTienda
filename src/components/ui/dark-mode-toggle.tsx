"use client"

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DarkModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-10 h-10"
    >
      <SunIcon
        className={cn(
          "rotate-0 scale-100 transition-all",
          theme === "dark" && "rotate-90 scale-0"
        )}
      />
      <MoonIcon
        className={cn(
          "absolute rotate-90 scale-0 transition-all",
          theme === "dark" && "rotate-0 scale-100"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
