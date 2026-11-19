import { Show } from "solid-js";
import { usePwa } from "@/pwa";
import { AppIcon, type AppIconName } from "./AppIcon";

export function AppHeader(props: {
  title: string;
  rightIcon?: AppIconName;
  rightIconTooltip?: string;
  rightIconBadgeCount?: number;
  onRightIconPress?: () => void;
  testId?: string;
  rightIconTestId?: string;
}) {
  const pwa = usePwa();

  return (
    <header class="app-header" data-testid={props.testId}>
      <div class="app-header__left">
        <h1 class="app-header__title">{props.title}</h1>
        <span
          class={[
            "pwa-pill",
            pwa.isOnline() ? "pwa-pill--online" : "pwa-pill--offline",
          ]}
          title={pwa.isOnline() ? "Connected" : "Offline mode active"}
        >
          <AppIcon name={pwa.isOnline() ? "wifi" : "wifi-off"} size={14} />
          <span>{pwa.isOnline() ? "Online" : "Offline"}</span>
        </span>
      </div>

      <div class="app-header__actions">
        <Show when={pwa.canInstall()}>
          <button
            type="button"
            class="header-install-btn"
            onClick={() => void pwa.installApp()}
            aria-label="Install PWA"
          >
            <AppIcon name="download" size={16} />
            <span>Install</span>
          </button>
        </Show>

        <Show when={props.rightIcon}>
          {(icon) => (
            <button
              type="button"
              class="icon-btn"
              data-testid={props.rightIconTestId}
              title={props.rightIconTooltip}
              aria-label={props.rightIconTooltip ?? props.title}
              onClick={() => props.onRightIconPress?.()}
            >
              <AppIcon name={icon()} size={22} />
              <Show when={(props.rightIconBadgeCount ?? 0) > 0}>
                <span class="icon-btn__badge">{props.rightIconBadgeCount}</span>
              </Show>
            </button>
          )}
        </Show>
      </div>
    </header>
  );
}
