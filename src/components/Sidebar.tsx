import { JSX, ParentProps, Show, mergeProps } from "solid-js";
import { A, useLocation } from "solid-start";
import { twMerge } from "tailwind-merge";
import { AiOutlineLock, AiOutlineLogin, AiOutlineTrophy, AiOutlineUser } from 'solid-icons/ai'
import { User } from "lucia";
import { logoutAction$ } from "~/lib/server";

export function Sidebar(props: { user: User | undefined }) {
  const user = () => props.user
  const [logging, logout] = logoutAction$()
  return <div class='bg-custom-blue-200 flex flex-col w-16 shrink-0 justify-between hover:w-64 transition-all group z-10'>
    <div>
      <Logo />
      <Navbar user={user()} />
    </div>
    <Show when={user()} fallback={<div class="p-2 bg-custom-blue-300 flex items-center transition-all">
      <a href="/api/login/discord" class="rounded-lg w-min border border-custom-purple-text text-custom-purple-text p-[10px] opacity-100 block group-hover:opacity-0 group-hover:hidden transition-all"><AiOutlineLogin fill="#a3a3a3" size={24} /></a>
      <a href="/api/login/discord" class="rounded-lg border border-custom-purple-text text-custom-purple-text p-[10px] opacity-0 hidden group-hover:opacity-100 group-hover:block transition-all m-auto whitespace-nowrap">Login via discord</a>
    </div>}>
      <div class="flex gap-2 p-2 bg-custom-blue-300 transition-all">
        <img src={user()?.image_url} width={48} height={48} class="rounded-full" alt={user()?.name} />
        <div class="justify-between w-full opacity-0 hidden group-hover:opacity-100 group-hover:flex transition-all">
          <div class="flex flex-col" >
            <span class="font-bold text-custom-white-100">{user()?.name!}</span>
            <span class="flex gap-2">
              <span class="font-bold text-custom-yellow-100">{user()?.points}</span>
              <img src={"/lolbets-logo.png"} alt="Logo" width={24} />
            </span>
          </div>
          <button onClick={() => logout()} class="border-custom-purple-text text-custom-purple-text p-[10px] border rounded-lg">Logout</button>
        </div>
      </div>
    </Show>
  </div>
}


function Logo() {
  return <A class={'flex items-center gap-6 m-2 self-center cursor-pointer'} href={"/"} >
    <img src="/lolbets-logo.png" alt="Logo" width={48} height={48} />
    <h1 class='text-4xl font-bold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all'>LOLBETS</h1>
  </A>
}

function Navbar(props: { user: User | undefined }) {
  const location = useLocation()
  return <div class='flex flex-col gap-4 m-2 mt-10 justify-center'>
    <NavbarElement href="/lolbets/league" icon={<AiOutlineTrophy fill="#a3a3a3" size={24} />} selected={location.pathname.includes("league")}>
      Leagues
    </NavbarElement>
    <NavbarElement href="/lolbets/team" icon={<AiOutlineUser fill="#a3a3a3" size={24} />} selected={location.pathname.includes("team")}>
      Teams
    </NavbarElement>
    <Show when={props.user?.isAdmin}>
      <NavbarElement href="/lolbets/admin" icon={<AiOutlineLock fill="#a3a3a3" size={24} />} selected={location.pathname.includes("admin")}>
        Admin
      </NavbarElement>
    </Show>
  </div>
}

interface NavbarElementProps {
  icon: JSX.Element
  href: string
  selected: boolean
}

function NavbarElement(props: ParentProps<NavbarElementProps>) {
  const merged = mergeProps({ selected: false }, props)
  return <A
    href={merged.href}
    class={twMerge(
      "flex items-center gap-6 border border-gray-600 border-opacity-0 hover:border-opacity-100 transition-all rounded-lg p-3",
      merged.selected ? "border-opacity-60" : ""
    )}
  >
    <span class="w-6 h-6">
      {merged.icon}
    </span>
    <span class={twMerge(
      "font-semibold text-custom-white-200 text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible  transition-all",
      merged.selected ? "text-custom-white-100" : ""
    )}>
      {merged.children}
    </span>
  </A>
}