export function AppSwitch(props: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  testId?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={props.checked ? "true" : "false"}
      aria-label={props.ariaLabel}
      data-testid={props.testId}
      class={["app-switch", { "app-switch--checked": props.checked }]}
      onClick={() => props.onChange(!props.checked)}
    >
      <span class="app-switch__thumb" />
    </button>
  );
}
