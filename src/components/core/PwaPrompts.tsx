import { Show } from "solid-js";
import { usePwa } from "@/pwa";
import { AppButton } from "./AppButton";
import { AppIcon } from "./AppIcon";

export function PwaUpdateToast() {
  const pwa = usePwa();

  return (
    <Show when={pwa.offlineReady() || pwa.needRefresh()}>
      <div class="pwa-toast" role="alert" aria-live="polite">
        <div class="pwa-toast__icon">
          <AppIcon
            name={pwa.needRefresh() ? "refresh" : "check-circle-outline"}
            size={20}
          />
        </div>
        <div class="pwa-toast__text">
          <Show
            when={pwa.needRefresh()}
            fallback={<span>App cached and ready to work offline.</span>}
          >
            <span>New version available. Reload to update.</span>
          </Show>
        </div>
        <div class="pwa-toast__actions">
          <Show when={pwa.needRefresh()}>
            <AppButton
              label="Reload"
              variant="filled"
              onClick={() => void pwa.updateServiceWorker(true)}
            />
          </Show>
          <AppButton
            label="Dismiss"
            variant="text"
            onClick={() => {
              pwa.dismissOfflineReady();
              pwa.dismissNeedRefresh();
            }}
          />
        </div>
      </div>
    </Show>
  );
}
