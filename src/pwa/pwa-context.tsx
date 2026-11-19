import {
  type Accessor,
  createContext,
  createSignal,
  onSettled,
  type ParentProps,
  useContext,
} from "solid-js";
import { useRegisterSW } from "virtual:pwa-register/solid";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export interface PwaContextValue {
  isOnline: Accessor<boolean>;
  isInstalled: Accessor<boolean>;
  canInstall: Accessor<boolean>;
  swRegistered: Accessor<boolean>;
  offlineReady: Accessor<boolean>;
  needRefresh: Accessor<boolean>;
  installApp: () => Promise<"accepted" | "dismissed" | "unavailable">;
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  dismissOfflineReady: () => void;
  dismissNeedRefresh: () => void;
}

const PwaContext = createContext<PwaContextValue>();

function detectStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const standaloneMatch = window.matchMedia?.(
    "(display-mode: standalone)",
  ).matches;
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
    true;
  return Boolean(standaloneMatch || iosStandalone);
}

export function PwaProvider(props: ParentProps) {
  const [isOnline, setIsOnline] = createSignal(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [isInstalled, setIsInstalled] = createSignal(detectStandalone());
  const [deferredPrompt, setDeferredPrompt] =
    createSignal<BeforeInstallPromptEvent | null>(null);
  const [swRegistered, setSwRegistered] = createSignal(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW() {
      setSwRegistered(true);
    },
    onRegistered() {
      setSwRegistered(true);
    },
  });

  onSettled(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    const displayMedia = window.matchMedia?.("(display-mode: standalone)");
    const handleDisplayChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsInstalled(true);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    displayMedia?.addEventListener("change", handleDisplayChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
      displayMedia?.removeEventListener("change", handleDisplayChange);
    };
  });

  const canInstall = () => deferredPrompt() !== null && !isInstalled();

  const installApp = async (): Promise<
    "accepted" | "dismissed" | "unavailable"
  > => {
    const promptEvent = deferredPrompt();
    if (!promptEvent) return "unavailable";
    await promptEvent.prompt();
    const result = await promptEvent.userChoice;
    if (result.outcome === "accepted") {
      setDeferredPrompt(null);
    }
    return result.outcome;
  };

  const value: PwaContextValue = {
    isOnline,
    isInstalled,
    canInstall,
    swRegistered,
    offlineReady,
    needRefresh,
    installApp,
    updateServiceWorker,
    dismissOfflineReady: () => setOfflineReady(false),
    dismissNeedRefresh: () => setNeedRefresh(false),
  };

  return <PwaContext value={value}>{props.children}</PwaContext>;
}

export function usePwa(): PwaContextValue {
  const ctx = useContext(PwaContext);
  if (!ctx) {
    throw new Error("usePwa must be used within a PwaProvider");
  }
  return ctx;
}
