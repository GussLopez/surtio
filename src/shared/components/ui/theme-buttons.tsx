'use client'

import { cn } from "@/shared/utils/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeButtons() {
  const { theme, setTheme, systemTheme } = useTheme();
  console.log(systemTheme);

  return (
    <div className="flex items-center gap-2">
      <button
        className={cn(theme === 'light' && 'border border-input rounded-md', "p-1")}
        onClick={() => setTheme('light')}
      >
        <Sun className={cn(theme === 'light' ? 'opacity-100' : 'opacity-60 hover:opacity-100', "size-4.5 transition-opacity")} />
      </button>
      <button
        className={cn(theme === 'dark' && 'border border-input rounded-md', "p-1")}
        onClick={() => setTheme('dark')}
      >
        <Moon className={cn(theme === 'dark' ? 'opacity-100' : 'opacity-60 hover:opacity-100', "size-4.5 transition-opacity")} />
      </button>
      <button
        className={cn(theme === 'system' && 'border border-input rounded-md', "p-1")}
        onClick={() => setTheme("system")}
      >
        <Monitor className={cn(theme === 'system' ? 'opacity-100' : 'opacity-60 hover:opacity-100', "size-4.5 transition-opacity")} />
      </button>
    </div>
  )
}
