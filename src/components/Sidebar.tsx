import { JSX, ParentProps, mergeProps } from "solid-js";
import { A, useLocation } from "solid-start";
import { twMerge } from "tailwind-merge";
import { AiOutlineTeam, AiOutlineTrophy } from 'solid-icons/ai'

export function Sidebar() {
  return <div class='bg-custom-blue-200 flex flex-col w-16 shrink-0 justify-between hover:w-64 transition-all group'>
    <div>
      <Logo />
      <Navbar />
    </div>
    <button class="p-2 bg-custom-purple-100">Login</button>
  </div>
}


function Logo() {
  return <A class={'flex items-center gap-6 m-2 self-center cursor-pointer'} href={"/"} >
    <img src="/lolbets-logo.png" alt="Logo" width={48} height={48} />
    <h1 class='text-4xl font-bold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all'>LOLBETS</h1>
  </A>
}

function Navbar() {
  const location = useLocation()
  location.pathname
  return <div class='flex flex-col gap-4 m-2 mt-10 justify-center'>
    <NavbarElement href="/league" icon={<AiOutlineTrophy fill="#a3a3a3" size={24} />} selected={location.pathname.includes("league")}>
      Leagues
    </NavbarElement>
    <NavbarElement href="/team" icon={<AiOutlineTeam fill="#a3a3a3" size={24} />} selected={location.pathname.includes("team")}>
      Teams
    </NavbarElement>
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