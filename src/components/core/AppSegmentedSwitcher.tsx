import { For, Show } from "solid-js";
import { AppIcon, type AppIconName } from "./AppIcon";

export interface SegmentedSwitcherOption<T extends string> {
  value: T;
  label: string;
  icon?: AppIconName;
}

export function AppSegmentedSwitcher<T extends string>(props: {
  options: readonly SegmentedSwitcherOption<T>[];
  selected: T;
  onChange: (value: T) => void;
  testId?: string;
}) {
  return (
    <div class="segmented" role="group" data-testid={props.testId}>
      <For each={props.options}>
        {(option) => (
          <button
            type="button"
            aria-pressed={props.selected === option.value ? "true" : "false"}
            class={[
              "segmented__item",
              { "segmented__item--active": props.selected === option.value },
            ]}
            onClick={() => props.onChange(option.value)}
          >
            <Show when={option.icon}>
              {(icon) => <AppIcon name={icon()} size={16} />}
            </Show>
            <span>{option.label}</span>
          </button>
        )}
      </For>
    </div>
  );
}
