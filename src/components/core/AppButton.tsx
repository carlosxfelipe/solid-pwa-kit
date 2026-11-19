import { Show } from "solid-js";
import { AppIcon, type AppIconName } from "./AppIcon";

export type AppButtonVariant = "filled" | "tonal" | "outlined" | "text";

export function AppButton(props: {
  label: string;
  variant?: AppButtonVariant;
  leftIcon?: AppIconName;
  rightIcon?: AppIconName;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  testId?: string;
}) {
  return (
    <button
      type={props.type ?? "button"}
      data-testid={props.testId}
      disabled={props.isDisabled || props.isLoading}
      onClick={() => {
        if (!props.isDisabled && !props.isLoading) {
          props.onClick?.();
        }
      }}
      class={[
        "app-btn",
        `app-btn--${props.variant ?? "filled"}`,
        {
          "app-btn--full": Boolean(props.fullWidth),
          "app-btn--loading": Boolean(props.isLoading),
        },
      ]}
    >
      <Show when={props.isLoading}>
        <span class="app-spinner" aria-hidden="true" />
      </Show>
      <Show when={!props.isLoading && props.leftIcon}>
        {(icon) => <AppIcon name={icon()} size={18} />}
      </Show>
      <span>{props.label}</span>
      <Show when={!props.isLoading && props.rightIcon}>
        {(icon) => <AppIcon name={icon()} size={18} />}
      </Show>
    </button>
  );
}
