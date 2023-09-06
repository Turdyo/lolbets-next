import { Outlet, useRouteData } from "solid-start";
import { Toaster } from "solid-toast";
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
    <Toaster toastOptions={{
      className: 'border-2 border-gray-600',
      style: {
        background: '#1f2937',
        color: '#f3f4f6'
      }
    }} />
  </div>
}