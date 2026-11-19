import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import {
  captureArtifact,
  expectNoDiagnostics,
  expectRerunBudget,
} from "@solidjs/diagnostics";
import { flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import Counter, { resetGlobalCounter } from "./Counter";

describe("<Counter />", () => {
  beforeEach(() => {
    resetGlobalCounter();
    flush();
  });

  afterEach(() => {
    cleanup();
  });

  test("it increments on click, persists across remounts, and resets", () => {
    const firstRender = render(() => <Counter />);
    const incrementButton = firstRender.getByRole("button", {
      name: /Clicks:/,
    });
    expect(incrementButton).toHaveTextContent("Clicks: 0");

    fireEvent.click(incrementButton);
    flush();
    expect(incrementButton).toHaveTextContent("Clicks: 1");
    firstRender.unmount();

    const secondRender = render(() => <Counter />);
    const remountedButton = secondRender.getByRole("button", {
      name: /Clicks:/,
    });
    expect(remountedButton).toHaveTextContent("Clicks: 1");

    fireEvent.click(secondRender.getByRole("button", { name: /Reset/ }));
    flush();
    expect(remountedButton).toHaveTextContent("Clicks: 0");
  });

  test("a click re-runs one scope and trips no diagnostic", async () => {
    // captureArtifact opens Solid's dev-mode channels around the scenario —
    // diagnostics (coded reactive anti-patterns) and attribution (which
    // scopes re-ran, and why) — and folds what they saw into one artifact.
    const { artifact } = await captureArtifact(
      () => {
        const { getByRole } = render(() => <Counter />);
        const button = getByRole("button", { name: /Clicks:/ });
        fireEvent.click(button);
        flush();
        expect(button).toHaveTextContent("Clicks: 1");
      },
      { scenario: "counter-click" },
    );
    // Correctness gate: nothing fired. Each code maps to its repair in
    // node_modules/solid-js/skills/reactivity-diagnostics/SKILL.md.
    expectNoDiagnostics(artifact);
    // Granularity gate: one click re-runs exactly one scope — the button's
    // text binding — and nothing else. Raise the budget only with a reason;
    // `artifact.attribution.reruns` says what ran and what caused it.
    expectRerunBudget(artifact, 1);
  });
});
