import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { useAuthSession } from "@/auth";
import {
  AppButton,
  AppIcon,
  AppTextField,
  useSnackbar,
} from "@/components/core";
import { paths } from "@/router";

export default function Login() {
  const { signIn } = useAuthSession();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [emailError, setEmailError] = createSignal<string | undefined>();
  const [passwordError, setPasswordError] = createSignal<string | undefined>();

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError() && value.trim().length > 0) {
      setEmailError(undefined);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError() && value.length > 0) {
      setPasswordError(undefined);
    }
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    let valid = true;

    if (email().trim().length === 0) {
      setEmailError("Please enter your email");
      valid = false;
    } else {
      setEmailError(undefined);
    }

    if (password().length === 0) {
      setPasswordError("Please enter your password");
      valid = false;
    } else {
      setPasswordError(undefined);
    }

    if (!valid) return;
    signIn(email());
    navigate(paths());
  };

  return (
    <main class="login-page">
      <Title>Sign in - Solid PWA Kit</Title>
      <form class="login-card" onSubmit={handleSubmit} novalidate>
        <div class="login-card__logo">
          <AppIcon name="routes" size={26} />
        </div>
        <h1 class="login-card__title">Welcome back</h1>
        <p class="login-card__subtitle">
          Sign in to continue to Solid PWA Kit.
        </p>

        <div class="stack-md mt-24">
          <AppTextField
            value={email()}
            onInput={handleEmailChange}
            label="Email"
            type="email"
            placeholder="you@example.com"
            prefixIcon="email-outline"
            autocomplete="email"
            errorText={emailError()}
            testId="login-email-input"
          />
          <AppTextField
            value={password()}
            onInput={handlePasswordChange}
            label="Password"
            prefixIcon="lock-outline"
            obscureText
            enableVisibilityToggle
            autocomplete="current-password"
            errorText={passwordError()}
            testId="login-password-input"
          />
        </div>

        <div class="stack-sm mt-24">
          <AppButton
            type="submit"
            label="Sign in"
            rightIcon="arrow-right"
            fullWidth
            testId="login-submit-btn"
          />
          <AppButton
            label="Create account"
            variant="text"
            fullWidth
            onClick={() => showSnackbar("Create account flow not configured")}
          />
        </div>
      </form>
    </main>
  );
}
