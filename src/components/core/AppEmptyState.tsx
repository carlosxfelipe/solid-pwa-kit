import { Show } from "solid-js";
import { AppButton } from "./AppButton";
import { AppIcon, type AppIconName } from "./AppIcon";

export function AppEmptyState(props: {
  icon: AppIconName;
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: AppIconName;
  onAction?: () => void;
  testId?: string;
}) {
  return (
    <div class="empty-state" data-testid={props.testId}>
      <div class="empty-state__icon">
        <AppIcon name={props.icon} size={28} />
      </div>
      <h3 class="empty-state__title">{props.title}</h3>
      <p class="empty-state__desc">{props.description}</p>
      <Show when={props.actionLabel && props.onAction}>
        <AppButton
          label={props.actionLabel!}
          leftIcon={props.actionIcon}
          variant="tonal"
          onClick={props.onAction}
        />
      </Show>
    </div>
  );
}
