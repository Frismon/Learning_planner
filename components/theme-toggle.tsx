"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button
      variant="outline"
      className="rounded-full shadow-md border-2 border-primary flex items-center gap-2"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Перемкнути тему"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="hidden md:inline">{theme === "dark" ? "Світла тема" : "Темна тема"}</span>
    </Button>
  )
} 