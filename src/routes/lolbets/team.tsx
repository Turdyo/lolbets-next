import Fuse from "fuse.js"
import { AiOutlineSearch } from "solid-icons/ai"
import { For, Show, createSignal } from "solid-js"
import { A, Outlet, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import { twMerge } from "tailwind-merge"
import { db } from "~/db/prisma"

export function routeData() {
  return createServerData$(() => db.team.findMany({
    select: {
      acronym: true,
      image_url: true,
      name: true
    },
    orderBy: {
      name: "asc"
    }
  }))
}

export default function Layout() {
  const teams = useRouteData<typeof routeData>()
  const [focused, setFocused] = createSignal<boolean>(false)
  const [searchInput, setSearchInput] = createSignal<string>("")
  const fuse = () => new Fuse(teams() ?? [], { keys: ["acronym", "name"] })
  const results = () => searchInput() === "" ? teams() : fuse().search(searchInput()).map(result => result.item)

  return <div class="p-14 flex flex-col justify-evenly h-full w-full">
    <div class={twMerge("relative self-center border border-gray-700 bg-custom-blue-200 rounded-xl", focused() ? "rounded-b-none" : "")}>
      <div class="flex gap-2 items-center">
        <input
          placeholder="Search..."
          type="text"
          class={twMerge("rounded-xl p-4 w-[500px] bg-custom-blue-200 focus:outline-none")}
          onInput={(event) => setSearchInput(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={async () => {
            await new Promise(r => setTimeout(r, 150))
            setFocused(false)
          }}
        />
        <AiOutlineSearch size={24} fill={"#a3a3a3"} class="mr-4"/>
      </div>
      <Show when={focused()}>
        <div class="rounded-xl rounded-t-none max-h-[400px] h-min overflow-auto bg-custom-blue-200 border-t-0 border-gray-700 border absolute w-[550px] -left-px z-10">
          <For each={results()}>
            {(result) => <A href={`/lolbets/team/${result.name}`} class="flex gap-2 p-3 items-center hover:bg-custom-blue-500">
              <img alt={result.name} src={result.image_url} height={24} width={24} />
              <span>{result.name}</span>
            </A>}
          </For>
        </div>
      </Show>
    </div>
    <div class="basis-full mt-10 overflow-hidden">
      <Outlet />
    </div>
  </div>
}