import { Title } from "@solidjs/meta";
import { For } from "solid-js";
import { AppBannerCard, AppListCard } from "@/components/core";
import users from "@/data/users.json";
import { paths } from "@/router";

export default function UsersIndex() {
  return (
    <section class="stack-sm">
      <Title>Users - Solid PWA Kit</Title>
      <AppBannerCard
        icon="users"
        tone="secondary"
        title="Solid 2.0 Async Graph"
        description="Each profile uses @solidjs/router query() with intentPreload() and Solid 2.0 createMemo()."
      />
      <For each={Object.entries(users)}>
        {([id, user]) => (
          <AppListCard
            icon="account-outline"
            title={user.name}
            subtitle={user.title}
            href={paths.users(Number(id))()}
          />
        )}
      </For>
    </section>
  );
}
