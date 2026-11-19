import { type Element as SolidElement, Show } from "solid-js";
import { AppIcon, type AppIconName } from "./AppIcon";

export function AppListCard(props: {
  icon: AppIconName;
  title: string;
  subtitle?: string;
  showChevron?: boolean;
  trailing?: SolidElement;
  onClick?: () => void;
  href?: string;
  testId?: string;
}) {
  const content = () => (
    <>
      <span class="list-card__icon">
        <AppIcon name={props.icon} size={20} />
      </span>
      <span class="list-card__body">
        <span class="list-card__title">{props.title}</span>
        <Show when={props.subtitle}>
          <span class="list-card__subtitle">{props.subtitle}</span>
        </Show>
      </span>
      <Show when={props.trailing}>
        <span class="list-card__trailing" onClick={(e) => e.stopPropagation()}>
          {props.trailing}
        </span>
      </Show>
      <Show when={!props.trailing && (props.showChevron ?? true)}>
        <span class="list-card__chevron">
          <AppIcon name="chevron-right" size={20} />
        </span>
      </Show>
    </>
  );

  return (
    <Show
      when={props.href}
      fallback={
        <div
          role={props.onClick ? "button" : undefined}
          tabindex={props.onClick ? 0 : undefined}
          data-testid={props.testId}
          class={[
            "list-card",
            { "list-card--interactive": Boolean(props.onClick) },
          ]}
          onClick={() => props.onClick?.()}
          onKeyDown={(e) => {
            if (props.onClick && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              props.onClick();
            }
          }}
        >
          {content()}
        </div>
      }
    >
      {(href) => (
        <a
          href={href()}
          data-testid={props.testId}
          class="list-card list-card--interactive"
        >
          {content()}
        </a>
      )}
    </Show>
  );
}
