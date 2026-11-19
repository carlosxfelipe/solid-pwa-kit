import { createSignal } from "solid-js";
import { AppIcon } from "./core/AppIcon";

const STORAGE_KEY = "solid-pwa-kit:signal-counter";

function readStoredCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function writeStoredCount(next: number): number {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Ignore storage errors in restricted contexts.
    }
  }
  return next;
}

// Module-level signal so the counter state persists across route changes.
const [count, setCount] = createSignal(readStoredCount());

export function resetGlobalCounter(): void {
  setCount(writeStoredCount(0));
}

export default function Counter() {
  return (
    <div class="counter-widget">
      <div class="counter-widget__info">
        <span class="counter-widget__title">Global reactive signal</span>
        <span class="counter-widget__subtitle">
          Persists across routes and reloads
        </span>
      </div>
      <div class="counter-widget__actions">
        <button
          class="app-btn app-btn--filled counter-widget__btn"
          onClick={() => setCount((c) => writeStoredCount(c + 1))}
          type="button"
        >
          <AppIcon name="plus" size={18} />
          <span>Clicks: {count()}</span>
        </button>
        <button
          class="app-btn app-btn--outlined"
          onClick={resetGlobalCounter}
          type="button"
        >
          <AppIcon name="refresh" size={16} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
