import { Show } from "solid-js";
import { AppIcon } from "./AppIcon";

function getInitials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function AppAvatar(props: {
  name?: string;
  size?: number;
  showOnlineBadge?: boolean;
  ariaLabel?: string;
  testId?: string;
}) {
  return (
    <div
      class="app-avatar"
      data-testid={props.testId}
      aria-label={props.ariaLabel ?? props.name ?? "User avatar"}
      style={{
        width: `${props.size ?? 48}px`,
        height: `${props.size ?? 48}px`,
      }}
    >
      <Show
        when={getInitials(props.name)}
        fallback={
          <AppIcon name="account" size={Math.round((props.size ?? 48) * 0.5)} />
        }
      >
        {(initials) => <span class="app-avatar__initials">{initials()}</span>}
      </Show>
      <Show when={props.showOnlineBadge}>
        <span class="app-avatar__badge" />
      </Show>
    </div>
  );
}
