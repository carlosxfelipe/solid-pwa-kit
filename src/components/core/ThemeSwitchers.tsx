import {
  type AppThemePreset,
  THEME_MODE_LABELS,
  THEME_PRESET_LABELS,
  type ThemeMode,
  useAppTheme,
} from "@/theme";
import {
  AppSegmentedSwitcher,
  type SegmentedSwitcherOption,
} from "./AppSegmentedSwitcher";

const MODE_OPTIONS: readonly SegmentedSwitcherOption<ThemeMode>[] = [
  { value: "light", label: THEME_MODE_LABELS.light, icon: "sun" },
  { value: "dark", label: THEME_MODE_LABELS.dark, icon: "moon" },
  { value: "system", label: THEME_MODE_LABELS.system, icon: "monitor" },
];

const PRESET_OPTIONS: readonly SegmentedSwitcherOption<AppThemePreset>[] = [
  {
    value: "custom_blue",
    label: THEME_PRESET_LABELS.custom_blue,
    icon: "palette-outline",
  },
  {
    value: "deep_purple",
    label: THEME_PRESET_LABELS.deep_purple,
    icon: "palette-outline",
  },
];

export function ThemeSwitcher(props: { testId?: string }) {
  const { themeMode, setThemeMode } = useAppTheme();

  return (
    <AppSegmentedSwitcher
      options={MODE_OPTIONS}
      selected={themeMode()}
      onChange={setThemeMode}
      testId={props.testId}
    />
  );
}

export function ThemePresetSwitcher(props: { testId?: string }) {
  const { themePreset, setThemePreset } = useAppTheme();

  return (
    <AppSegmentedSwitcher
      options={PRESET_OPTIONS}
      selected={themePreset()}
      onChange={setThemePreset}
      testId={props.testId}
    />
  );
}
