import {
  type Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onSettled,
  type ParentProps,
  useContext,
} from "solid-js";
import {
  type AppColorScheme,
  type AppThemePreset,
  applyThemeToDocument,
  DEFAULT_THEME_PRESET,
  THEME_PRESETS,
  type ThemeMode,
} from "./theme-tokens";

const STORAGE_MODE_KEY = "solid-pwa-kit:theme-mode";
const STORAGE_PRESET_KEY = "solid-pwa-kit:theme-preset";

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const raw = window.localStorage.getItem(STORAGE_MODE_KEY);
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
  } catch {
    // Ignore storage access errors in restricted contexts.
  }
  return "system";
}

function readStoredPreset(fallback: AppThemePreset): AppThemePreset {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_PRESET_KEY);
    if (raw === "custom_blue" || raw === "deep_purple") return raw;
  } catch {
    // Ignore storage access errors in restricted contexts.
  }
  return fallback;
}

function getSystemDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export interface ThemeContextValue {
  themeMode: Accessor<ThemeMode>;
  setThemeMode: (mode: ThemeMode) => void;
  themePreset: Accessor<AppThemePreset>;
  setThemePreset: (preset: AppThemePreset) => void;
  resolvedScheme: Accessor<"light" | "dark">;
  isDark: Accessor<boolean>;
  colors: Accessor<AppColorScheme>;
}

const ThemeContext = createContext<ThemeContextValue>();

export function ThemeProvider(
  props: ParentProps<{ initialPreset?: AppThemePreset }>,
) {
  const [themeMode, setThemeModeSignal] =
    createSignal<ThemeMode>(readStoredMode());
  const [themePreset, setThemePresetSignal] = createSignal<AppThemePreset>(
    readStoredPreset(props.initialPreset ?? DEFAULT_THEME_PRESET),
  );
  const [systemDark, setSystemDark] = createSignal<boolean>(getSystemDark());

  onSettled(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(media.matches);
    const onChange = (event: MediaQueryListEvent) => {
      setSystemDark(event.matches);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  });

  const resolvedScheme = createMemo<"light" | "dark">(() => {
    const mode = themeMode();
    if (mode === "system") {
      return systemDark() ? "dark" : "light";
    }
    return mode;
  });

  const isDark = createMemo(() => resolvedScheme() === "dark");

  const colors = createMemo<AppColorScheme>(() => {
    const pair = THEME_PRESETS[themePreset()];
    return isDark() ? pair.dark : pair.light;
  });

  createEffect(
    () => ({
      scheme: resolvedScheme(),
      preset: themePreset(),
      palette: colors(),
    }),
    ({ scheme, preset, palette }) => {
      applyThemeToDocument(palette, scheme, preset);
    },
  );

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeSignal(mode);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_MODE_KEY, mode);
      } catch {
        // Ignore storage errors.
      }
    }
  };

  const setThemePreset = (preset: AppThemePreset) => {
    setThemePresetSignal(preset);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_PRESET_KEY, preset);
      } catch {
        // Ignore storage errors.
      }
    }
  };

  const value: ThemeContextValue = {
    themeMode,
    setThemeMode,
    themePreset,
    setThemePreset,
    resolvedScheme,
    isDark,
    colors,
  };

  return <ThemeContext value={value}>{props.children}</ThemeContext>;
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return ctx;
}
