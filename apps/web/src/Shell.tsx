import type { JSX, Component } from "solid-js";
import { useLocation } from "@solidjs/router";
import { AppShell } from "@consultancy/ui";
import { useSession, signOut } from "./lib/auth-client";
import LayoutDashboard from "lucide-solid/icons/layout-dashboard";
import Archive from "lucide-solid/icons/archive";
import Users from "lucide-solid/icons/users";
import Settings from "lucide-solid/icons/settings";
import UserSearch from "lucide-solid/icons/user-search";

interface NavEntry {
  id: string;
  href: string;
  label: string;
  icon: Component;
  // Match strategy: "exact" only matches that path; "prefix" matches any sub-path.
  match: "exact" | "prefix";
}

const NAV_ITEMS: NavEntry[] = [
  {
    id: "dashboard",
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    match: "exact",
  },
  {
    id: "evidence",
    href: "/evidence",
    label: "My Evidence",
    icon: Archive,
    match: "prefix",
  },
  {
    id: "peer-review",
    href: "/peer-review",
    label: "Peer Review",
    icon: Users,
    match: "prefix",
  },
  {
    id: "people",
    href: "/people",
    label: "People",
    icon: UserSearch,
    match: "prefix",
  },
  {
    id: "admin",
    href: "/admin",
    label: "Admin",
    icon: Settings,
    match: "prefix",
  },
];

// Title overrides for pages not in the primary nav (e.g. sub-pages).
const TITLE_OVERRIDES: Record<string, string> = {
  "/evidence/add": "Add Evidence",
};

function resolveTitleOverride(pathname: string): string | undefined {
  if (TITLE_OVERRIDES[pathname]) return TITLE_OVERRIDES[pathname];
  if (/^\/peer-review\/.+/.test(pathname)) return "Review Evidence";
  return undefined;
}

interface ShellProps {
  children: JSX.Element;
}

export function Shell(props: ShellProps) {
  const session = useSession();
  const location = useLocation();

  const activeItem = () => {
    const path = location.pathname;
    return NAV_ITEMS.find((item) =>
      item.match === "exact" ? path === item.href : path.startsWith(item.href),
    );
  };

  const pageTitle = () =>
    resolveTitleOverride(location.pathname) ??
    activeItem()?.label ??
    "Contractor Hub";

  const navItems = () =>
    NAV_ITEMS.map((item) => ({
      id: item.id,
      href: item.href,
      label: item.label,
      icon: item.icon,
      isActive: item === activeItem(),
    }));

  return (
    <AppShell
      title={pageTitle()}
      navMenuProps={{
        title: "Contractor Hub",
        items: navItems(),
        user: session()?.data?.user
          ? { name: session()!.data!.user!.name! }
          : undefined,
        onSignOut: () => signOut(),
      }}
    >
      {props.children}
    </AppShell>
  );
}
