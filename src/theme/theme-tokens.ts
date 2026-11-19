export type ThemeMode = "light" | "dark" | "system";
export type AppThemePreset = "custom_blue" | "deep_purple";

export const THEME_MODE_LABELS: Record<ThemeMode, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export const THEME_PRESET_LABELS: Record<AppThemePreset, string> = {
  custom_blue: "Custom Blue",
  deep_purple: "Deep Purple",
};

export interface AppColorScheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  surface: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  inverseSurface: string;
  onInverseSurface: string;
  inversePrimary: string;
  online: string;
}

export interface AppThemePair {
  seedColor: string;
  light: AppColorScheme;
  dark: AppColorScheme;
}

export const CustomBlueTheme: AppThemePair = {
  seedColor: "#2196F3",
  light: {
    primary: "#0061A4",
    onPrimary: "#FFFFFF",
    primaryContainer: "#D1E4FF",
    onPrimaryContainer: "#001D36",
    secondary: "#535F70",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#D7E3F7",
    onSecondaryContainer: "#101C2B",
    tertiary: "#6B5778",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#F2DAFF",
    onTertiaryContainer: "#251431",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",
    surface: "#FFFFFF",
    surfaceContainerLowest: "#FFFFFF",
    surfaceContainerLow: "#F7F7FA",
    surfaceContainer: "#F2F2F7",
    surfaceContainerHigh: "#ECECF2",
    surfaceContainerHighest: "#E5E5EC",
    onSurface: "#141418",
    onSurfaceVariant: "#494954",
    outline: "#73777F",
    outlineVariant: "#DADAE3",
    inverseSurface: "#2E3135",
    onInverseSurface: "#F0F0F3",
    inversePrimary: "#9ECAFF",
    online: "#2E7D32",
  },
  dark: {
    primary: "#9ECAFF",
    onPrimary: "#003258",
    primaryContainer: "#00497D",
    onPrimaryContainer: "#D1E4FF",
    secondary: "#BBC7DB",
    onSecondary: "#253140",
    secondaryContainer: "#3B4858",
    onSecondaryContainer: "#D7E3F7",
    tertiary: "#D6BEE4",
    onTertiary: "#3B2948",
    tertiaryContainer: "#523F5F",
    onTertiaryContainer: "#F2DAFF",
    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",
    surface: "#000000",
    surfaceContainerLowest: "#000000",
    surfaceContainerLow: "#0D0D10",
    surfaceContainer: "#141418",
    surfaceContainerHigh: "#1C1C22",
    surfaceContainerHighest: "#24242C",
    onSurface: "#F5F5F7",
    onSurfaceVariant: "#B8B8C4",
    outline: "#8D9199",
    outlineVariant: "#2C2C35",
    inverseSurface: "#E2E2E6",
    onInverseSurface: "#2E3135",
    inversePrimary: "#0061A4",
    online: "#4CAF50",
  },
};

export const DeepPurpleTheme: AppThemePair = {
  seedColor: "#673AB7",
  light: {
    primary: "#6750A4",
    onPrimary: "#FFFFFF",
    primaryContainer: "#EADDFF",
    onPrimaryContainer: "#21005D",
    secondary: "#625B71",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#E8DEF8",
    onSecondaryContainer: "#1D192B",
    tertiary: "#7D5260",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#FFD8E4",
    onTertiaryContainer: "#31111D",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",
    surface: "#FEF7FF",
    surfaceContainerLowest: "#FFFFFF",
    surfaceContainerLow: "#F7F2FA",
    surfaceContainer: "#F3EDF7",
    surfaceContainerHigh: "#ECE6F0",
    surfaceContainerHighest: "#E6E0E9",
    onSurface: "#1D1B20",
    onSurfaceVariant: "#49454F",
    outline: "#79747E",
    outlineVariant: "#CAC4D0",
    inverseSurface: "#322F35",
    onInverseSurface: "#F5EFF7",
    inversePrimary: "#D0BCFF",
    online: "#2E7D32",
  },
  dark: {
    primary: "#D0BCFF",
    onPrimary: "#381E72",
    primaryContainer: "#4F378B",
    onPrimaryContainer: "#EADDFF",
    secondary: "#CCC2DC",
    onSecondary: "#332D41",
    secondaryContainer: "#4A4458",
    onSecondaryContainer: "#E8DEF8",
    tertiary: "#EFB8C8",
    onTertiary: "#492532",
    tertiaryContainer: "#633B48",
    onTertiaryContainer: "#FFD8E4",
    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",
    surface: "#141218",
    surfaceContainerLowest: "#0F0D13",
    surfaceContainerLow: "#1D1B20",
    surfaceContainer: "#211F26",
    surfaceContainerHigh: "#2B2930",
    surfaceContainerHighest: "#36343B",
    onSurface: "#E6E0E9",
    onSurfaceVariant: "#CAC4D0",
    outline: "#938F99",
    outlineVariant: "#49454F",
    inverseSurface: "#E6E0E9",
    onInverseSurface: "#322F35",
    inversePrimary: "#6750A4",
    online: "#4CAF50",
  },
};

export const THEME_PRESETS: Record<AppThemePreset, AppThemePair> = {
  custom_blue: CustomBlueTheme,
  deep_purple: DeepPurpleTheme,
};

export const DEFAULT_THEME_PRESET: AppThemePreset = "custom_blue";

const COLOR_VAR_MAP: Record<keyof AppColorScheme, string> = {
  primary: "--md-primary",
  onPrimary: "--md-on-primary",
  primaryContainer: "--md-primary-container",
  onPrimaryContainer: "--md-on-primary-container",
  secondary: "--md-secondary",
  onSecondary: "--md-on-secondary",
  secondaryContainer: "--md-secondary-container",
  onSecondaryContainer: "--md-on-secondary-container",
  tertiary: "--md-tertiary",
  onTertiary: "--md-on-tertiary",
  tertiaryContainer: "--md-tertiary-container",
  onTertiaryContainer: "--md-on-tertiary-container",
  error: "--md-error",
  onError: "--md-on-error",
  errorContainer: "--md-error-container",
  onErrorContainer: "--md-on-error-container",
  surface: "--md-surface",
  surfaceContainerLowest: "--md-surface-container-lowest",
  surfaceContainerLow: "--md-surface-container-low",
  surfaceContainer: "--md-surface-container",
  surfaceContainerHigh: "--md-surface-container-high",
  surfaceContainerHighest: "--md-surface-container-highest",
  onSurface: "--md-on-surface",
  onSurfaceVariant: "--md-on-surface-variant",
  outline: "--md-outline",
  outlineVariant: "--md-outline-variant",
  inverseSurface: "--md-inverse-surface",
  onInverseSurface: "--md-on-inverse-surface",
  inversePrimary: "--md-inverse-primary",
  online: "--md-online",
};

export function applyThemeToDocument(
  colors: AppColorScheme,
  resolvedScheme: "light" | "dark",
  preset: AppThemePreset,
): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = resolvedScheme;
  root.dataset.preset = preset;
  root.style.colorScheme = resolvedScheme;

  for (const [key, cssVar] of Object.entries(COLOR_VAR_MAP)) {
    root.style.setProperty(cssVar, colors[key as keyof AppColorScheme]);
  }

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute("content", colors.primary);
  }
}
