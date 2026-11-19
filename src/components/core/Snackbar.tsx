import {
  createContext,
  createSignal,
  onSettled,
  type ParentProps,
  Show,
  useContext,
} from "solid-js";

interface SnackbarState {
  id: number;
  message: string;
}

export interface SnackbarContextValue {
  showSnackbar: (message: string, durationMs?: number) => void;
  dismissSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextValue>();

export function SnackbarProvider(props: ParentProps) {
  const [snackbar, setSnackbar] = createSignal<SnackbarState | null>(null);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let seq = 0;

  onSettled(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  });

  const dismissSnackbar = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
    setSnackbar(null);
  };

  const showSnackbar = (message: string, durationMs = 3000) => {
    if (timer) clearTimeout(timer);
    seq += 1;
    setSnackbar({ id: seq, message });
    timer = setTimeout(() => {
      setSnackbar(null);
      timer = undefined;
    }, durationMs);
  };

  return (
    <SnackbarContext value={{ showSnackbar, dismissSnackbar }}>
      {props.children}
      <Show when={snackbar()}>
        {(item) => (
          <div class="snackbar-host" role="status" aria-live="polite">
            <div class="snackbar" data-snackbar-id={item().id}>
              <span>{item().message}</span>
              <button
                type="button"
                class="snackbar-dismiss"
                onClick={dismissSnackbar}
                aria-label="Dismiss notification"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </Show>
    </SnackbarContext>
  );
}

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return ctx;
}
