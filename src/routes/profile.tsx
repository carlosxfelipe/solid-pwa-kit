import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { useAuthSession } from "@/auth";
import {
  AppAvatar,
  AppBottomSheet,
  AppButton,
  AppHeader,
  AppListCard,
  AppSwitch,
  ThemePresetSwitcher,
  ThemeSwitcher,
  useSnackbar,
} from "@/components/core";
import { usePwa } from "@/pwa";
import { paths } from "@/router";
import { THEME_MODE_LABELS, THEME_PRESET_LABELS, useAppTheme } from "@/theme";

export default function Profile() {
  const { themeMode, themePreset } = useAppTheme();
  const { userEmail, signOut } = useAuthSession();
  const { showSnackbar } = useSnackbar();
  const pwa = usePwa();
  const navigate = useNavigate();

  const [notificationsEnabled, setNotificationsEnabled] = createSignal(true);
  const [appearanceSheetVisible, setAppearanceSheetVisible] =
    createSignal(false);
  const [signOutSheetVisible, setSignOutSheetVisible] = createSignal(false);

  return (
    <div class="page">
      <Title>Profile - Solid PWA Kit</Title>
      <AppHeader title="Profile" testId="profile-header" />

      <main class="page-content">
        <section class="profile-card">
          <AppAvatar
            name="User Profile"
            size={64}
            showOnlineBadge
            ariaLabel="User avatar"
          />
          <div class="profile-card__info">
            <h2 class="profile-card__name">User Profile</h2>
            <p class="profile-card__email">{userEmail()}</p>
          </div>
        </section>

        <h2 class="section-heading">Account</h2>
        <div class="stack-sm">
          <AppListCard
            icon="account-edit-outline"
            title="Edit Profile"
            subtitle="Update your name and personal info"
            onClick={() => showSnackbar("Edit profile coming soon")}
          />
          <AppListCard
            icon="bell-outline"
            title="Notifications"
            subtitle={notificationsEnabled() ? "Enabled" : "Disabled"}
            trailing={
              <AppSwitch
                checked={notificationsEnabled()}
                onChange={setNotificationsEnabled}
                ariaLabel="Notifications"
              />
            }
            onClick={() => setNotificationsEnabled((prev) => !prev)}
          />
          <AppListCard
            icon="shield-lock-outline"
            title="Privacy & Security"
            subtitle="Password and session settings"
            onClick={() => showSnackbar("Privacy & Security coming soon")}
          />
        </div>

        <h2 class="section-heading">Preferences & PWA</h2>
        <div class="stack-sm">
          <AppListCard
            icon="cog-outline"
            title="Appearance"
            subtitle={`Theme: ${THEME_MODE_LABELS[themeMode()]} · ${THEME_PRESET_LABELS[themePreset()]}`}
            onClick={() => setAppearanceSheetVisible(true)}
            testId="profile-appearance-card"
          />
          <AppListCard
            icon={pwa.isOnline() ? "wifi" : "wifi-off"}
            title="PWA Status"
            subtitle={`Service Worker: ${pwa.swRegistered() ? "Active" : "Registering"} · ${pwa.isInstalled() ? "Standalone" : "Browser tab"}`}
            showChevron={false}
          />
          <Show when={pwa.canInstall()}>
            <AppListCard
              icon="download"
              title="Install App"
              subtitle="Add Solid PWA Kit to your home screen or desktop"
              onClick={() => void pwa.installApp()}
            />
          </Show>
        </div>

        <div class="mt-20">
          <AppButton
            label="Sign out"
            variant="outlined"
            leftIcon="logout"
            fullWidth
            onClick={() => setSignOutSheetVisible(true)}
            testId="profile-signout-btn"
          />
        </div>
      </main>

      <AppBottomSheet
        visible={appearanceSheetVisible()}
        onClose={() => setAppearanceSheetVisible(false)}
        title="Appearance"
        testId="profile-appearance-sheet"
      >
        <p class="sheet-label">App theme</p>
        <ThemeSwitcher testId="theme-mode-switcher" />
        <p class="sheet-label sheet-label--spaced">Color palette</p>
        <ThemePresetSwitcher testId="theme-preset-switcher" />
      </AppBottomSheet>

      <AppBottomSheet
        visible={signOutSheetVisible()}
        onClose={() => setSignOutSheetVisible(false)}
        title="Sign out"
      >
        <p class="sheet-message">
          Are you sure you want to sign out of your account?
        </p>
        <div class="sheet-actions">
          <AppButton
            label="Cancel"
            variant="outlined"
            fullWidth
            onClick={() => setSignOutSheetVisible(false)}
          />
          <AppButton
            label="Sign out"
            leftIcon="logout"
            fullWidth
            onClick={() => {
              setSignOutSheetVisible(false);
              signOut();
              navigate(paths.login());
            }}
          />
        </div>
      </AppBottomSheet>
    </div>
  );
}
