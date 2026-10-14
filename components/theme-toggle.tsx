"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribeToTheme(callback: () => void) {
  window.addEventListener("campus-eats-theme-change", callback);
  return () => window.removeEventListener("campus-eats-theme-change", callback);
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => false);

  function toggleTheme() {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("campus-eats-theme", nextIsDark ? "dark" : "light");
    window.dispatchEvent(new Event("campus-eats-theme-change"));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#66736A] transition hover:bg-[#F0F4EE] hover:text-[#1C2B24]"
    >
      {isDark ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
}
