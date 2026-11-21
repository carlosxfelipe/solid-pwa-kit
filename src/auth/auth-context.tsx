import {
  type Accessor,
  createContext,
  createSignal,
  onSettled,
  type ParentProps,
  useContext,
} from "solid-js";

// Set to true to enforce /login before accessing the main app shell.
export const REQUIRE_AUTH = false;

const STORAGE_AUTH_KEY = "solid-pwa-kit:auth-email";

function readStoredEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_AUTH_KEY);
  } catch {
    return null;
  }
}

export interface AuthSessionContextValue {
  authReady: Accessor<boolean>;
  isAuthenticated: Accessor<boolean>;
  userEmail: Accessor<string>;
  signIn: (email?: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthSessionContextValue>();

export function AuthProvider(props: ParentProps) {
  const initialEmail = readStoredEmail();
  // Starts false during SSR/prerender (when window is unavailable) and resolves
  // on client settle; async auth backends should keep it false until session
  // hydration completes so route guards do not redirect prematurely.
  const [authReady, setAuthReady] = createSignal(typeof window !== "undefined");
  const [isAuthenticated, setIsAuthenticated] = createSignal(
    !REQUIRE_AUTH || initialEmail !== null,
  );
  const [userEmail, setUserEmail] = createSignal(
    initialEmail ?? "user@example.com",
  );

  onSettled(() => {
    const storedEmail = readStoredEmail();
    if (storedEmail !== null) {
      setUserEmail(storedEmail);
      setIsAuthenticated(true);
    }
    setAuthReady(true);
  });

  const signIn = (email?: string) => {
    const nextEmail = email?.trim() || "user@example.com";
    setUserEmail(nextEmail);
    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_AUTH_KEY, nextEmail);
      } catch {
        // Ignore storage errors.
      }
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_AUTH_KEY);
      } catch {
        // Ignore storage errors.
      }
    }
  };

  const value: AuthSessionContextValue = {
    authReady,
    isAuthenticated,
    userEmail,
    signIn,
    signOut,
  };

  return <AuthContext value={value}>{props.children}</AuthContext>;
}

export function useAuthSession(): AuthSessionContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthSession must be used within an AuthProvider");
  }
  return ctx;
}
