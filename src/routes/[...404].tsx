import { Title } from "@solidjs/meta";
import { type RouteDefinition, useNavigate } from "@solidjs/router";
import { httpStatus } from "@solidjs/web";
import { AppEmptyState, AppHeader } from "@/components/core";
import { paths } from "@/router";

export const route = {
  preload: () => httpStatus(404),
} satisfies RouteDefinition;

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div class="page">
      <Title>Not Found - Solid PWA Kit</Title>
      <AppHeader title="Page not found" />
      <main class="page-content">
        <AppEmptyState
          icon="compass-outline"
          title="404 — Route not found"
          description="The requested route does not exist in this PWA."
          actionLabel="Go Home"
          actionIcon="home-outline"
          onAction={() => navigate(paths())}
        />
      </main>
    </div>
  );
}
