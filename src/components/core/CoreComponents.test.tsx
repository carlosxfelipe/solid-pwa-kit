import { fireEvent, render } from "@solidjs/testing-library";
import { captureArtifact, expectNoDiagnostics } from "@solidjs/diagnostics";
import { createSignal, flush } from "solid-js";
import { describe, expect, test, vi } from "vitest";
import { AuthProvider, useAuthSession } from "@/auth";
import { ThemeProvider, useAppTheme } from "@/theme";
import { AppBottomSheet } from "./AppBottomSheet";
import { AppButton } from "./AppButton";
import { AppSwitch } from "./AppSwitch";
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
});
