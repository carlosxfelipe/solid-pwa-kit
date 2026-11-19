import type { ParentProps } from "solid-js";
import { AppHeader } from "@/components/core";

export default function UsersLayout(props: ParentProps) {
  return (
    <div class="page">
      <AppHeader title="Users" testId="users-header" />
      <main class="page-content">{props.children}</main>
    </div>
  );
}
