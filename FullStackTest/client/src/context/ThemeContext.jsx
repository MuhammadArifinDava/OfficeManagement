import { createContext, useCallback, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "theme";

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

function applyThemeClass(mode) {
  const root = document.documentElement;
  const effective = mode === "system" ? getSystemTheme() : mode;
  root.classList.toggle("dark", effective === "dark");
}

function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => localStorage.getItem(STORAGE_KEY) || "system");

  const setMode = useCallback((nextMode) => {
    const value = nextMode || "system";
    setModeState(value);
    localStorage.setItem(STORAGE_KEY, value);
  }, []);

  useEffect(() => {
    applyThemeClass(mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return;
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mql) return;
    const onChange = () => applyThemeClass("system");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      effective: mode === "system" ? getSystemTheme() : mode,
    }),
    [mode, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export { ThemeContext, ThemeProvider };

