import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "wpa-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const initial =
      stored === "dark" ||
      (stored === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(KEY, dark ? "dark" : "light");
  }, [dark, ready]);

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setDark((d) => !d)}
      className="rounded-full"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
