import { type Element as SolidElement, Show } from "solid-js";
import { AppIcon, type AppIconName } from "./AppIcon";

export function AppBannerCard(props: {
  title: string;
  description: string;
  icon?: AppIconName;
  tone?: "primary" | "secondary";
  footer?: SolidElement;
  testId?: string;
}) {
  return (
    <section
      data-testid={props.testId}
      class={["app-banner", `app-banner--${props.tone ?? "primary"}`]}
    >
      <div class="app-banner__head">
        <Show when={props.icon}>
          {(icon) => (
            <div class="app-banner__icon">
              <AppIcon name={icon()} size={22} />
            </div>
          )}
        </Show>
        <div class="app-banner__copy">
          <h2 class="app-banner__title">{props.title}</h2>
          <p class="app-banner__desc">{props.description}</p>
        </div>
      </div>
      <Show when={props.footer}>
        <div class="app-banner__footer">{props.footer}</div>
      </Show>
    </section>
  );
}
