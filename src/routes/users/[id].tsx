import { Title } from "@solidjs/meta";
import {
  query,
  type RouteDefinition,
  type RouteProps,
  useNavigate,
} from "@solidjs/router";
import { createMemo, isPending } from "solid-js";
import { AppAvatar, AppButton } from "@/components/core";
import users from "@/data/users.json";
import { paths } from "@/router";

const getUser = query(async (id: string) => {
  return (
    users[id as keyof typeof users] ?? {
      name: "Unknown",
      title: "No such user",
    }
  );
}, "user");

export const route = {
  preload: ({ params }) => void getUser(params.id!),
} satisfies RouteDefinition;

export default function User(props: RouteProps<"/users/:id">) {
  const user = createMemo(() => getUser(props.params.id));
  const navigate = useNavigate();

  return (
    <section
      class="surface-box stack-md"
      style={{ opacity: isPending(user) ? 0.5 : 1 }}
    >
      <Title>{`User ${props.params.id} - Solid PWA Kit`}</Title>
      <div class="profile-card">
        <AppAvatar name={user().name} size={56} showOnlineBadge />
        <div class="profile-card__info">
          <h2 class="profile-card__name">{user().name}</h2>
          <p class="profile-card__email">{user().title}</p>
        </div>
      </div>
      <div class="wrap-row">
        <AppButton
          label="All users"
          variant="outlined"
          onClick={() => navigate(paths.users())}
        />
        <AppButton
          label="Next user"
          rightIcon="arrow-right"
          onClick={() => navigate(paths.users(Number(props.params.id) + 1))}
        />
      </div>
    </section>
  );
}
