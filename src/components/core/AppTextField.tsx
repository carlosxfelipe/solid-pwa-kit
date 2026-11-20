import type { JSX } from "@solidjs/web";
import {
  createEffect,
  createSignal,
  createUniqueId,
  onSettled,
  Show,
} from "solid-js";
import { AppIcon, type AppIconName } from "./AppIcon";

function isElementAutofilled(el: Element): boolean {
  try {
    return el.matches(":-webkit-autofill") || el.matches(":autofill");
  } catch {
    try {
      return el.matches(":-webkit-autofill");
    } catch {
      return false;
    }
  }
}

export interface AppTextFieldProps {
  value: string;
  onInput: (value: string) => void;
  label: string;
  placeholder?: string;
  hintText?: string;
  type?: "text" | "email" | "password";
  prefixIcon?: AppIconName;
  suffixIcon?: JSX.Element;
  obscureText?: boolean;
  enableVisibilityToggle?: boolean;
  errorText?: string;
  autocomplete?: string;
  enabled?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  borderRadius?: number;
  labelBackgroundColor?: string;
  onSubmitEditing?: () => void;
  ariaLabel?: string;
  testId?: string;
}

export function AppTextField(props: AppTextFieldProps) {
  const inputId = createUniqueId();
  const errorId = `${inputId}-error`;
  const [isFocused, setIsFocused] = createSignal(false);
  const [revealed, setRevealed] = createSignal(false);
  const [isAutofilled, setIsAutofilled] = createSignal(false);

  let inputRef: HTMLInputElement | HTMLTextAreaElement | undefined;

  createEffect(
    () => props.value,
    (value) => {
      if (value.length === 0) {
        setIsAutofilled(false);
      }
    },
  );

  onSettled(() => {
    const el = inputRef;
    if (!el || typeof el.addEventListener !== "function") return;

    if (isElementAutofilled(el)) {
      setIsAutofilled(true);
    }

    const handleAnimationStart = (event: AnimationEvent) => {
      if (event.animationName === "text-field-autofill-start") {
        setIsAutofilled(true);
      } else if (event.animationName === "text-field-autofill-cancel") {
        setIsAutofilled(false);
      }
    };

    el.addEventListener(
      "animationstart",
      handleAnimationStart as EventListener,
    );
    return () => {
      el.removeEventListener(
        "animationstart",
        handleAnimationStart as EventListener,
      );
    };
  });

  const isEnabled = () => props.enabled !== false && !props.disabled;
  const isObscured = () => Boolean(props.obscureText) && !revealed();
  const isMultiline = () => Boolean(props.multiline) && !isObscured();
  const isFloated = () =>
    isFocused() || props.value.length > 0 || isAutofilled();
  const hasError = () => Boolean(props.errorText);
  const effectivePlaceholder = () => props.placeholder ?? props.hintText;

  const inputType = () => {
    if (props.obscureText) {
      return revealed() ? "text" : "password";
    }
    return props.type ?? "text";
  };

  const handleInput = (next: string) => {
    if (next.length === 0) {
      setIsAutofilled(false);
    }
    props.onInput(next);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !isMultiline() && props.onSubmitEditing) {
      props.onSubmitEditing();
    }
  };

  const boxStyle = (): JSX.CSSProperties | undefined => {
    const styles: JSX.CSSProperties = {};
    if (props.borderRadius !== undefined) {
      styles["border-radius"] = `${props.borderRadius}px`;
    }
    if (props.labelBackgroundColor !== undefined) {
      styles["--text-field-label-bg"] = props.labelBackgroundColor;
    }
    return Object.keys(styles).length > 0 ? styles : undefined;
  };

  return (
    <div
      class="text-field"
      data-testid={props.testId ? `${props.testId}-wrapper` : undefined}
    >
      <div
        class={[
          "text-field__box",
          {
            "text-field__box--focused": isFocused(),
            "text-field__box--error": hasError(),
            "text-field__box--disabled": !isEnabled(),
          },
        ]}
        style={boxStyle()}
        data-testid={props.testId ? `${props.testId}-container` : undefined}
        onClick={(e) => {
          if (!isEnabled()) return;
          if (!(e.target as Element).closest("button")) {
            inputRef?.focus();
          }
        }}
      >
        <label
          for={inputId}
          class={[
            "text-field__label-wrapper",
            {
              "text-field__label-wrapper--with-prefix": Boolean(
                props.prefixIcon,
              ),
              "text-field__label-wrapper--floated": isFloated(),
              "text-field__label-wrapper--focused": isFocused(),
              "text-field__label-wrapper--error": hasError(),
            },
          ]}
        >
          <span class="text-field__label-cutout" aria-hidden="true" />
          <span class="text-field__label-text">{props.label}</span>
        </label>

        <Show when={props.prefixIcon}>
          {(icon) => (
            <span class="text-field__prefix" aria-hidden="true">
              <AppIcon name={icon()} size={20} />
            </span>
          )}
        </Show>

        <Show
          when={isMultiline()}
          fallback={
            <input
              ref={(el) => {
                inputRef = el;
              }}
              id={inputId}
              data-testid={props.testId}
              type={inputType()}
              value={props.value}
              placeholder={isFocused() ? effectivePlaceholder() : undefined}
              autocomplete={props.autocomplete}
              disabled={!isEnabled()}
              aria-label={props.ariaLabel}
              aria-invalid={hasError() ? "true" : undefined}
              aria-describedby={hasError() ? errorId : undefined}
              onInput={(e) => handleInput(e.currentTarget.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              class="text-field__input"
            />
          }
        >
          <textarea
            ref={(el) => {
              inputRef = el;
            }}
            id={inputId}
            data-testid={props.testId}
            value={props.value}
            rows={props.rows ?? 3}
            placeholder={isFocused() ? effectivePlaceholder() : undefined}
            autocomplete={props.autocomplete}
            disabled={!isEnabled()}
            aria-label={props.ariaLabel}
            aria-invalid={hasError() ? "true" : undefined}
            aria-describedby={hasError() ? errorId : undefined}
            onInput={(e) => handleInput(e.currentTarget.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            class="text-field__input text-field__input--multiline"
          />
        </Show>

        <Show
          when={props.suffixIcon}
          fallback={
            <Show when={props.obscureText && props.enableVisibilityToggle}>
              <span class="text-field__suffix">
                <button
                  type="button"
                  class="text-field__toggle"
                  disabled={!isEnabled()}
                  data-testid={
                    props.testId ? `${props.testId}-toggle` : undefined
                  }
                  onClick={() => setRevealed((prev) => !prev)}
                  aria-label={revealed() ? "Hide password" : "Show password"}
                >
                  <AppIcon name={revealed() ? "eye-off" : "eye"} size={20} />
                </button>
              </span>
            </Show>
          }
        >
          {(suffix) => <span class="text-field__suffix">{suffix()}</span>}
        </Show>
      </div>

      <Show when={props.errorText}>
        {(err) => (
          <p
            id={errorId}
            class="text-field__error"
            data-testid={props.testId ? `${props.testId}-error` : undefined}
          >
            {err()}
          </p>
        )}
      </Show>
    </div>
  );
}
