import { Outlet, useRouteData } from "solid-start";
import { Sidebar } from "~/components/Sidebar";
import { useSession } from "~/lib/server";

export function routeData() {
  return useSession()
}

export default function Layout() {
  const user = useRouteData<typeof routeData>()

  return <div class="flex h-screen">
    <Sidebar user={user()} />
    <Outlet />
  </div>
}