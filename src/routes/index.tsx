import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";
import {
  AppBannerCard,
  AppButton,
  AppHeader,
  AppListCard,
  useSnackbar,
} from "@/components/core";
import { usePwa } from "@/pwa";
import { paths } from "@/router";

export default function Home() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const pwa = usePwa();

  const handleInstall = async () => {
    const outcome = await pwa.installApp();
    if (outcome === "accepted") {
      showSnackbar("Solid PWA Kit installed!");
    } else if (outcome === "dismissed") {
      showSnackbar("Installation cancelled");
    } else {
      showSnackbar(
        'Use your browser menu -> "Install app" / "Add to Home Screen"',
      );
    }
  };

  return (
    <div class="page">
      <Title>Home - Solid PWA Kit</Title>
      <AppHeader
        title="Home"
        rightIcon="bell-outline"
        rightIconTooltip="Notifications"
        rightIconBadgeCount={3}
        onRightIconPress={() => showSnackbar("3 new notifications")}
        testId="home-header"
        rightIconTestId="home-notifications-btn"
      />

      <main class="page-content">
        <AppBannerCard
          icon="routes"
          title="Welcome to Solid PWA Kit"
          description="Progressive Web App starter built with Solid 2.0, file-system @solidjs/router, Workbox service worker, and Material 3 themes."
          testId="home-welcome-banner"
          footer={
            <div class="banner-actions">
              <Show
                when={!pwa.isInstalled()}
                fallback={
                  <span class="badge-installed">Running as installed PWA</span>
                }
              >
                <AppButton
                  label={pwa.canInstall() ? "Install PWA" : "How to Install"}
                  variant="tonal"
                  leftIcon="download"
                  onClick={() => void handleInstall()}
                  testId="home-install-btn"
                />
              </Show>
              <AppButton
                label="Explore UI"
                variant="outlined"
                rightIcon="arrow-right"
                onClick={() => navigate(paths.explore())}
              />
            </div>
          }
        />

        <h2 class="section-heading">Quick Navigation</h2>
        <div class="stack-sm">
          <AppListCard
            icon="compass-outline"
            title="Explore"
            subtitle="Interactive Material 3 components & Solid 2.0 demos"
            href={paths.explore()}
            testId="home-explore-card"
          />
          <AppListCard
            icon="users"
            title="Users (Async Graph)"
            subtitle="Solid 2.0 query(), createMemo() & route preload"
            href={paths.users()}
            testId="home-users-card"
          />
          <AppListCard
            icon="account-outline"
            title="Profile"
            subtitle="Appearance presets, theme mode & PWA diagnostics"
            href={paths.profile()}
            testId="home-profile-card"
          />
        </div>

        <h2 class="section-heading">Resources</h2>
        <div class="stack-sm">
          <AppListCard
            icon="creation-outline"
            title="Solid 2.0 Documentation"
            subtitle="v2.solidjs.com — first-class async & fine-grained signals"
            onClick={() =>
              window.open(
                "https://v2.solidjs.com/",
                "_blank",
                "noopener,noreferrer",
              )
            }
          />
          <AppListCard
            icon="github"
            title="GitHub Repository"
            subtitle="carlosxfelipe/solid-pwa-kit"
            onClick={() =>
              window.open(
                "https://github.com/carlosxfelipe/solid-pwa-kit",
                "_blank",
                "noopener,noreferrer",
              )
            }
          />
        </div>
      </main>
    </div>
  );
}
