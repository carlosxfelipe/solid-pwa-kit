import { fireEvent, render } from "@solidjs/testing-library";
import { captureArtifact, expectNoDiagnostics } from "@solidjs/diagnostics";
import { createSignal, flush } from "solid-js";
import { describe, expect, test, vi } from "vitest";
import { AuthProvider, useAuthSession } from "@/auth";
import { ThemeProvider, useAppTheme } from "@/theme";
import { AppBottomSheet } from "./AppBottomSheet";
import { AppButton } from "./AppButton";
import { AppSwitch } from "./AppSwitch";
import { AppTextField } from "./AppTextField";
import { SnackbarProvider, useSnackbar } from "./Snackbar";
import { ThemePresetSwitcher, ThemeSwitcher } from "./ThemeSwitchers";

describe("Solid 2.0 Core Components & Providers", () => {
  test("ThemeProvider switches mode & preset with zero Solid diagnostics", async () => {
    const { artifact } = await captureArtifact(
      () => {
        function Probe() {
          const { resolvedScheme, themePreset } = useAppTheme();
          return (
            <div>
              <span data-testid="probe">{`${resolvedScheme()}:${themePreset()}`}</span>
              <ThemeSwitcher testId="mode-switcher" />
              <ThemePresetSwitcher testId="preset-switcher" />
            </div>
          );
        }

        const { getByTestId, getByRole } = render(() => (
          <ThemeProvider initialPreset="custom_blue">
            <Probe />
          </ThemeProvider>
        ));

        expect(getByTestId("probe")).toHaveTextContent("light:custom_blue");

        fireEvent.click(getByRole("button", { name: "Dark" }));
        fireEvent.click(getByRole("button", { name: "Deep Purple" }));
        flush();

        expect(getByTestId("probe")).toHaveTextContent("dark:deep_purple");
        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(document.documentElement.dataset.preset).toBe("deep_purple");
      },
      { scenario: "theme-switching" },
    );

    expectNoDiagnostics(artifact);
  });

  test("AppSwitch toggles aria-checked cleanly with zero diagnostics", async () => {
    const { artifact } = await captureArtifact(
      () => {
        function Wrapper() {
          const [checked, setChecked] = createSignal(false);
          return (
            <AppSwitch
              checked={checked()}
              onChange={setChecked}
              ariaLabel="Notifications"
            />
          );
        }

        const { getByRole } = render(() => <Wrapper />);
        const sw = getByRole("switch", { name: "Notifications" });
        expect(sw).toHaveAttribute("aria-checked", "false");

        fireEvent.click(sw);
        flush();
        expect(sw).toHaveAttribute("aria-checked", "true");
      },
      { scenario: "switch-toggle" },
    );

    expectNoDiagnostics(artifact);
  });

  test("AppBottomSheet opens and closes cleanly", () => {
    const onClose = vi.fn();
    const { queryByRole, getByRole } = render(() => (
      <AppBottomSheet visible={true} onClose={onClose} title="Quick Actions">
        <AppButton label="Confirm" onClick={onClose} />
      </AppBottomSheet>
    ));

    expect(
      queryByRole("dialog", { name: "Quick Actions" }),
    ).toBeInTheDocument();
    fireEvent.click(getByRole("button", { name: "Close Quick Actions" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("AuthProvider & SnackbarProvider work without diagnostics", async () => {
    const { artifact } = await captureArtifact(
      () => {
        function AuthProbe() {
          const { isAuthenticated, userEmail, signIn, signOut } =
            useAuthSession();
          const { showSnackbar } = useSnackbar();
          return (
            <div>
              <span data-testid="auth-state">
                {`${isAuthenticated()}:${userEmail()}`}
              </span>
              <AppButton
                label="Sign In"
                onClick={() => {
                  signIn("dev@solid.dev");
                  showSnackbar("Signed in");
                }}
              />
              <AppButton label="Sign Out" onClick={signOut} />
            </div>
          );
        }

        const { getByTestId, getByRole, queryByRole } = render(() => (
          <AuthProvider>
            <SnackbarProvider>
              <AuthProbe />
            </SnackbarProvider>
          </AuthProvider>
        ));

        fireEvent.click(getByRole("button", { name: "Sign In" }));
        flush();
        expect(getByTestId("auth-state")).toHaveTextContent(
          "true:dev@solid.dev",
        );
        expect(queryByRole("status")).toHaveTextContent("Signed in");

        fireEvent.click(getByRole("button", { name: "Sign Out" }));
        flush();
        expect(getByTestId("auth-state")).toHaveTextContent(
          "false:dev@solid.dev",
        );
      },
      { scenario: "auth-and-snackbar" },
    );

    expectNoDiagnostics(artifact);
  });

  test("AppTextField floats label on focus/value, toggles visibility, and shows error with zero diagnostics", async () => {
    const { artifact } = await captureArtifact(
      () => {
        function FormProbe() {
          const [email, setEmail] = createSignal("");
          const [password, setPassword] = createSignal("");
          const [error, setError] = createSignal<string | undefined>(undefined);

          return (
            <div>
              <AppTextField
                value={email()}
                onInput={setEmail}
                label="Email"
                placeholder="you@example.com"
                prefixIcon="email-outline"
                errorText={error()}
                testId="email-field"
              />
              <AppTextField
                value={password()}
                onInput={setPassword}
                label="Password"
                prefixIcon="lock-outline"
                obscureText
                enableVisibilityToggle
                testId="password-field"
              />
              <button type="button" onClick={() => setError("Required")}>
                Trigger error
              </button>
            </div>
          );
        }

        const { getByTestId, getByRole, queryByTestId } = render(() => (
          <FormProbe />
        ));

        const emailInput = getByTestId("email-field") as HTMLInputElement;
        const emailContainer = getByTestId("email-field-container");
        const emailLabel = emailContainer.querySelector(
          ".text-field__label-wrapper",
        )!;

        // Resting state: not floated, no placeholder until focused
        expect(emailLabel).not.toHaveClass(
          "text-field__label-wrapper--floated",
        );
        expect(emailLabel).toHaveClass(
          "text-field__label-wrapper--with-prefix",
        );
        expect(emailInput).not.toHaveAttribute("placeholder");

        // Focus: floats label and reveals placeholder
        fireEvent.focus(emailInput);
        flush();
        expect(emailContainer).toHaveClass("text-field__box--focused");
        expect(emailLabel).toHaveClass("text-field__label-wrapper--floated");
        expect(emailLabel).toHaveClass("text-field__label-wrapper--focused");
        expect(emailInput).toHaveAttribute("placeholder", "you@example.com");

        // Blur while empty: returns to resting state
        fireEvent.blur(emailInput);
        flush();
        expect(emailContainer).not.toHaveClass("text-field__box--focused");
        expect(emailLabel).not.toHaveClass(
          "text-field__label-wrapper--floated",
        );

        // Typing value: stays floated after blur
        fireEvent.input(emailInput, { target: { value: "a@b.com" } });
        flush();
        expect(emailLabel).toHaveClass("text-field__label-wrapper--floated");

        // Error state
        expect(queryByTestId("email-field-error")).not.toBeInTheDocument();
        fireEvent.click(getByRole("button", { name: "Trigger error" }));
        flush();
        expect(emailContainer).toHaveClass("text-field__box--error");
        expect(getByTestId("email-field-error")).toHaveTextContent("Required");

        // Password visibility toggle
        const passwordInput = getByTestId("password-field") as HTMLInputElement;
        expect(passwordInput.type).toBe("password");
        fireEvent.click(getByRole("button", { name: "Show password" }));
        flush();
        expect(passwordInput.type).toBe("text");
        fireEvent.click(getByRole("button", { name: "Hide password" }));
        flush();
        expect(passwordInput.type).toBe("password");
      },
      { scenario: "text-field-floating-label" },
    );

    expectNoDiagnostics(artifact);
  });
});
