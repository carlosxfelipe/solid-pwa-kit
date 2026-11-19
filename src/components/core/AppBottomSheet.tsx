import { onSettled, type ParentProps, Show } from "solid-js";
import { AppIcon } from "./AppIcon";

export function AppBottomSheet(
  props: ParentProps<{
    visible: boolean;
    onClose: () => void;
    title: string;
    testId?: string;
  }>,
) {
  onSettled(() => {
    if (typeof window === "undefined") return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && props.visible) {
        props.onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <Show when={props.visible}>
      <div
        class="sheet-backdrop"
        data-testid={props.testId}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            props.onClose();
          }
        }}
      >
        <div
          class="sheet-panel"
          role="dialog"
          aria-modal="true"
          aria-label={props.title}
        >
          <div class="sheet-panel__handle" aria-hidden="true" />
          <div class="sheet-panel__header">
            <h2 class="sheet-panel__title">{props.title}</h2>
            <button
              type="button"
              class="icon-btn"
              onClick={() => props.onClose()}
              aria-label={`Close ${props.title}`}
            >
              <AppIcon name="close" size={20} />
            </button>
          </div>
          <div class="sheet-panel__body">{props.children}</div>
        </div>
      </div>
    </Show>
  );
}
