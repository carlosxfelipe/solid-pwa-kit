import { Title } from "@solidjs/meta";
import { createSignal, onSettled, Show } from "solid-js";
import Counter from "@/components/Counter";
import {
  AppAvatar,
  AppBannerCard,
  AppBottomSheet,
  AppButton,
  AppEmptyState,
  AppHeader,
  AppListCard,
  AppSearchHeader,
  AppSegmentedSwitcher,
  AppSwitch,
  AppTextField,
  type SegmentedSwitcherOption,
  useSnackbar,
} from "@/components/core";

const VIEW_OPTIONS: readonly SegmentedSwitcherOption<
  "Day" | "Week" | "Month"
>[] = [
  { value: "Day", label: "Day", icon: "calendar-today-outline" },
  { value: "Week", label: "Week", icon: "view-week-outline" },
  { value: "Month", label: "Month", icon: "calendar-month-outline" },
];

const LAYOUT_OPTIONS: readonly SegmentedSwitcherOption<"List" | "Grid">[] = [
  { value: "List", label: "List", icon: "view-list-outline" },
  { value: "Grid", label: "Grid", icon: "view-grid-outline" },
];

export default function Explore() {
  const { showSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = createSignal(false);
  const [notificationsEnabled, setNotificationsEnabled] = createSignal(true);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [sheetVisible, setSheetVisible] = createSignal(false);
  const [selectedView, setSelectedView] = createSignal<
    "Day" | "Week" | "Month"
  >("Day");
  const [selectedLayout, setSelectedLayout] = createSignal<"List" | "Grid">(
    "List",
  );

  let loadingTimer: ReturnType<typeof setTimeout> | undefined;

  onSettled(() => {
    return () => {
      if (loadingTimer) clearTimeout(loadingTimer);
    };
  });

  const simulateLoading = () => {
    if (isLoading()) return;
    setIsLoading(true);
    loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div class="page">
      <Title>Explore - Solid PWA Kit</Title>
      <AppHeader title="Explore" testId="explore-header" />

      <main class="page-content">
        <h2 class="section-heading section-heading--first">
          Solid 2.0 Signal Counter
        </h2>
        <div class="surface-box">
          <Counter />
        </div>

        <h2 class="section-heading">AppButton Variants</h2>
        <div class="wrap-row">
          <AppButton
            label="Filled"
            onClick={() => showSnackbar("Filled tapped")}
          />
          <AppButton
            label="Tonal"
            variant="tonal"
            onClick={() => showSnackbar("Tonal tapped")}
          />
          <AppButton
            label="Outlined"
            variant="outlined"
            onClick={() => showSnackbar("Outlined tapped")}
          />
          <AppButton
            label="Text"
            variant="text"
            onClick={() => showSnackbar("Text tapped")}
          />
        </div>

        <h2 class="section-heading">Icons & States</h2>
        <div class="wrap-row">
          <AppButton
            label="Left Icon"
            leftIcon="plus"
            onClick={() => showSnackbar("Added item")}
          />
          <AppButton
            label="Right Icon"
            variant="outlined"
            rightIcon="arrow-right"
            onClick={() => showSnackbar("Continue")}
          />
          <AppButton label="Disabled" isDisabled />
          <AppButton
            label="Tap to Load"
            variant="tonal"
            isLoading={isLoading()}
            onClick={simulateLoading}
          />
        </div>
        <div class="mt-12">
          <AppButton
            label="Full Width Button"
            leftIcon="check-circle-outline"
            fullWidth
            onClick={() => showSnackbar("Full width action")}
          />
        </div>

        <h2 class="section-heading">AppSearchHeader</h2>
        <AppSearchHeader
          value={searchQuery()}
          hintText="Try searching..."
          onChange={setSearchQuery}
          testId="explore-search"
        />
        <Show when={searchQuery().length > 0}>
          <p class="helper-text">{`Query: "${searchQuery()}"`}</p>
        </Show>

        <h2 class="section-heading">AppListCard</h2>
        <div class="stack-sm">
          <AppListCard
            icon="palette-outline"
            title="Theme & Appearance"
            subtitle="Default card with icon and chevron"
            onClick={() => showSnackbar("AppListCard tapped")}
          />
          <AppListCard
            icon="bell-ring-outline"
            title="Push Notifications"
            subtitle={notificationsEnabled() ? "Enabled" : "Disabled"}
            trailing={
              <AppSwitch
                checked={notificationsEnabled()}
                onChange={setNotificationsEnabled}
                ariaLabel="Push Notifications"
              />
            }
            onClick={() => setNotificationsEnabled((prev) => !prev)}
          />
        </div>

        <h2 class="section-heading">AppBannerCard</h2>
        <AppBannerCard
          icon="creation-outline"
          tone="secondary"
          title="Featured Banner"
          description="Supports custom icon, Material 3 container tones, and an optional footer action."
          footer={
            <AppButton
              label="Learn more"
              variant="outlined"
              rightIcon="arrow-right"
              onClick={() => showSnackbar("AppBannerCard action")}
            />
          }
        />

        <h2 class="section-heading">AppEmptyState</h2>
        <AppEmptyState
          icon="inbox-outline"
          title="No items yet"
          description="Use AppEmptyState for empty lists, search results, or offline views."
          actionLabel="Create item"
          actionIcon="plus"
          onAction={() => showSnackbar("AppEmptyState action")}
        />

        <h2 class="section-heading">AppTextField</h2>
        <div class="stack-sm">
          <AppTextField
            value={username()}
            onInput={setUsername}
            label="Username"
            placeholder="Enter your handle"
            prefixIcon="at"
          />
          <AppTextField
            value={password()}
            onInput={setPassword}
            label="Password"
            prefixIcon="lock-outline"
            obscureText
            enableVisibilityToggle
          />
        </div>

        <h2 class="section-heading">AppBottomSheet</h2>
        <AppButton
          label="Open bottom sheet"
          leftIcon="tray-arrow-up"
          variant="outlined"
          fullWidth
          onClick={() => setSheetVisible(true)}
        />

        <h2 class="section-heading">AppAvatar</h2>
        <div class="wrap-row">
          <AppAvatar name="Carlos Araujo" size={48} showOnlineBadge />
          <AppAvatar name="Ada Lovelace" size={48} />
          <AppAvatar size={40} showOnlineBadge />
        </div>

        <h2 class="section-heading">AppSegmentedSwitcher</h2>
        <AppSegmentedSwitcher
          options={VIEW_OPTIONS}
          selected={selectedView()}
          onChange={setSelectedView}
        />
        <p class="helper-text">{`Selected view: ${selectedView()}`}</p>
        <div class="mt-12">
          <AppSegmentedSwitcher
            options={LAYOUT_OPTIONS}
            selected={selectedLayout()}
            onChange={setSelectedLayout}
          />
        </div>
        <p class="helper-text">{`Selected layout: ${selectedLayout()}`}</p>
      </main>

      <AppBottomSheet
        visible={sheetVisible()}
        onClose={() => setSheetVisible(false)}
        title="Quick Actions"
      >
        <div class="stack-sm">
          <AppListCard
            icon="share-variant-outline"
            title="Share link"
            subtitle="Copy route URL to clipboard"
            onClick={() => {
              setSheetVisible(false);
              showSnackbar("Route link copied");
            }}
          />
          <AppListCard
            icon="bookmark-outline"
            title="Save preset"
            subtitle="Store current configuration"
            onClick={() => {
              setSheetVisible(false);
              showSnackbar("Preset saved");
            }}
          />
        </div>
      </AppBottomSheet>
    </div>
  );
}
