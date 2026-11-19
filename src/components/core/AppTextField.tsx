import { createSignal, Show } from "solid-js";
import { AppIcon, type AppIconName } from "./AppIcon";

export function AppTextField(props: {
  value: string;
  onInput: (value: string) => void;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  prefixIcon?: AppIconName;
  obscureText?: boolean;
  enableVisibilityToggle?: boolean;
  errorText?: string;
  autocomplete?: string;
  testId?: string;
}) {
  const [revealed, setRevealed] = createSignal(false);

  const inputType = () => {
    if (props.obscureText) {
      return revealed() ? "text" : "password";
    }
    return props.type ?? "text";
  };

  return (
    <div class="text-field">
      <label class="text-field__label">{props.label}</label>
      <div
        class={[
          "text-field__box",
          { "text-field__box--error": Boolean(props.errorText) },
        ]}
      >
        <Show when={props.prefixIcon}>
          {(icon) => (
            <span class="text-field__prefix">
              <AppIcon name={icon()} size={18} />
            </span>
          )}
        </Show>
        <input
          data-testid={props.testId}
          type={inputType()}
          value={props.value}
          placeholder={props.placeholder}
          autocomplete={props.autocomplete}
          onInput={(e) => props.onInput(e.currentTarget.value)}
          class="text-field__input"
        />
        <Show when={props.obscureText && props.enableVisibilityToggle}>
          <button
            type="button"
            class="text-field__toggle"
            onClick={() => setRevealed((prev) => !prev)}
            aria-label={revealed() ? "Hide password" : "Show password"}
          >
            <AppIcon name={revealed() ? "eye-off" : "eye"} size={18} />
          </button>
        </Show>
      </div>
      <Show when={props.errorText}>
        {(err) => <p class="text-field__error">{err()}</p>}
      </Show>
    </div>
  );
}
