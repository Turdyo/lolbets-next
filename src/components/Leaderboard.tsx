import { User } from "@prisma/client";
import { For } from "solid-js";
import { twMerge } from "tailwind-merge";

interface LeaderboardProps {
  class?: string
  users?: Pick<User, "image" | "name" | "points">[]
}

export function Leaderboard(props: LeaderboardProps) {
  return <div class={twMerge("h-full flex flex-col gap-2 overflow-auto", props.class)} >
    <For each={props.users}>
      {(user, index) => <div class={twMerge("border w-full border-gray-700 rounded-lg flex gap-4 items-center justify-between p-4")}>
        <div class="flex items-center gap-4">
          <span class="text-custom-white-200 font-semibold">{index() + 1}</span>
          <img src={user.image!} alt={user.name!} width={40} height={40} class="rounded-full" />
          <span class={twMerge("font-semibold text-custom-white-200")}>{user.name}</span>
        </div>
        <div class="flex">
          <span class="font-bold text-custom-yellow-100">{user.points}</span>&nbsp;<span class="text-custom-white-200 font-semibold"></span>
          <img src="/lolbets-logo.png" alt="Logo" width={24} height={24} />
        </div>
      </div>}
    </For>
  </div>
}