import "@fontsource-variable/ubuntu-sans";
import { Title } from "@solidjs/meta";
import { useLocation, useNavigate } from "@solidjs/router";
import {
  createEffect,
  Errored,
  For,
  Loading,
  type ParentProps,
  Show,
} from "solid-js";
import { AuthProvider, REQUIRE_AUTH, useAuthSession } from "@/auth";
import {
  AppButton,
  AppIcon,
  type AppIconName,
  PwaUpdateToast,
  SnackbarProvider,
} from "@/components/core";
import { PwaProvider } from "@/pwa";
import { paths, Router } from "@/router";
import { ThemeProvider } from "@/theme";
import "./App.css";

interface NavTab {
  path: () => string;
  label: string;
  activeIcon: AppIconName;
  inactiveIcon: AppIconName;
  matchPrefix?: string;
}

const NAV_TABS: readonly NavTab[] = [
  {
    path: () => paths(),
    label: "Home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
  },
  {
    path: () => paths.explore(),
    label: "Explore",
    activeIcon: "compass",
    inactiveIcon: "compass-outline",
  },
  {
    path: () => paths.users(),
    label: "Users",
    activeIcon: "users",
    inactiveIcon: "users",
    matchPrefix: "/users",
  },
  {
    path: () => paths.profile(),
    label: "Profile",
    activeIcon: "account",
    inactiveIcon: "account-outline",
  },
];

function AppShell(props: ParentProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthSession();

  createEffect(
    () => ({
      auth: isAuthenticated(),
      pathname: location.pathname,
    }),
    ({ auth, pathname }) => {
      if (REQUIRE_AUTH && !auth && pathname !== paths.login()) {
        navigate(paths.login(), { replace: true });
      }
    },
  );

  const isLoginRoute = () => location.pathname === paths.login();

  const isTabActive = (tab: NavTab) => {
    const pathname = location.pathname;
    if (tab.matchPrefix) {
      return (
        pathname === tab.matchPrefix ||
        pathname.startsWith(`${tab.matchPrefix}/`)
      );
    }
    return pathname === tab.path();
  };

  return (
    <div class={["app-shell", { "app-shell--auth": isLoginRoute() }]}>
      <Show when={!isLoginRoute()}>
        <aside class="nav-rail" aria-label="Primary navigation">
          <div class="nav-rail__brand">
            <span class="nav-rail__logo">
              <AppIcon name="routes" size={22} />
            </span>
            <span class="nav-rail__name">Solid PWA</span>
          </div>
          <nav class="nav-rail__links">
            <For each={NAV_TABS}>
              {(tab) => (
                <a
                  href={tab.path()}
                  class={["nav-rail__item", { "is-active": isTabActive(tab) }]}
                  aria-current={isTabActive(tab) ? "page" : undefined}
                >
                  <span class="nav-rail__pill">
                    <AppIcon
                      name={
                        isTabActive(tab) ? tab.activeIcon : tab.inactiveIcon
                      }
                      size={20}
                    />
                  </span>
                  <span class="nav-rail__label">{tab.label}</span>
                </a>
              )}
            </For>
          </nav>
        </aside>
      </Show>

      <div class="app-shell__content">
        <Errored
          fallback={(err, reset) => (
            <main class="page-content">
              <div class="surface-box stack-md">
                <h2>Something went wrong</h2>
                <p class="helper-text">
                  {err instanceof Error ? err.message : String(err)}
                </p>
                <AppButton label="Retry" onClick={reset} />
              </div>
            </main>
          )}
        >
          <Loading
            fallback={
              <main class="page-content">
                <div class="loading-box">Loading…</div>
              </main>
            }
          >
            {props.children}
          </Loading>
        </Errored>
      </div>

      <Show when={!isLoginRoute()}>
        <nav class="bottom-nav" aria-label="Mobile navigation">
          <For each={NAV_TABS}>
            {(tab) => (
              <a
                href={tab.path()}
                class={["bottom-nav__item", { "is-active": isTabActive(tab) }]}
                aria-current={isTabActive(tab) ? "page" : undefined}
              >
                <span class="bottom-nav__pill">
                  <AppIcon
                    name={isTabActive(tab) ? tab.activeIcon : tab.inactiveIcon}
                    size={22}
                  />
                </span>
                <span class="bottom-nav__label">{tab.label}</span>
              </a>
            )}
          </For>
        </nav>
      </Show>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PwaProvider>
        <AuthProvider>
          <SnackbarProvider>
            <Title>Solid PWA Kit</Title>
            <Router>{(props) => <AppShell>{props.children}</AppShell>}</Router>
            <PwaUpdateToast />
          </SnackbarProvider>
        </AuthProvider>
      </PwaProvider>
    </ThemeProvider>
  );
}
