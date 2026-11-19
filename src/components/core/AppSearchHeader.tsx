import { Show } from "solid-js";
import { AppIcon } from "./AppIcon";

export function AppSearchHeader(props: {
  value: string;
  hintText?: string;
  onChange: (value: string) => void;
  testId?: string;
}) {
  return (
    <div class="search-header" data-testid={props.testId}>
      <span class="search-header__icon">
        <AppIcon name="search" size={18} />
      </span>
      <input
        type="search"
        value={props.value}
        placeholder={props.hintText ?? "Search..."}
        onInput={(e) => props.onChange(e.currentTarget.value)}
        class="search-header__input"
        aria-label={props.hintText ?? "Search"}
      />
      <Show when={props.value.length > 0}>
        <button
          type="button"
          class="search-header__clear"
          onClick={() => props.onChange("")}
          aria-label="Clear search"
        >
          <AppIcon name="close" size={16} />
        </button>
      </Show>
    </div>
  );
}
