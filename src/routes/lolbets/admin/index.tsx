import { Match, Team } from "@prisma/client";
import dayjs from "dayjs";
import { For, Show, onMount } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import toast from "solid-toast";
import { MatchComponent } from "~/components/MatchComponent";
import { Modal } from "~/components/ui/Modal";
import { SectionWithTitle } from "~/components/ui/SectionWithTitle";
import { db } from "~/db/prisma";
import { auth } from "~/lib/lucia";

export function routeData() {
  const user = createServerData$(async (_, event) => {
    const authRequest = auth.handleRequest(event.request);
    const session = await authRequest.validate();
    if (!session || !session.user.isAdmin) {
      return redirect("/lolbets") as never
    }
    return session.user
  })

  const teams = createServerData$(() =>
    db.team.findMany({
      where: {
        isCustom: true
      }
    })
  )
  const matches = createServerData$(async () => {
    const league = await db.league.findFirst({
      where: {
        name: "4eSport",
      },
      include: {
        match: {
          include: {
            opponents: true,
            bets: true,
            games: true,
          },
          orderBy: {
            scheduled_at: "asc"
          }
        },
      },
    })
    return league?.match
  })

  return { teams, matches }
}

export default function Admin() {
  const { teams, matches } = useRouteData<typeof routeData>();
  const [deleting, deleteTeam] = createServerAction$(async (teamId: number, event) => {
    const authRequest = auth.handleRequest(event.request)
    const session = await authRequest.validate()
    if (!session || !session.user.isAdmin) {
      return undefined as never
    }
    await db.team.delete({
      where: {
        id: teamId
      },
    })
  })
  const [deleting2, deleteMatch] = createServerAction$(async (matchId: number, event) => {
    const authRequest = auth.handleRequest(event.request)
    const session = await authRequest.validate()
    if (!session || !session.user.isAdmin) {
      return undefined as never
    }
    await db.match.delete({
      where: {
        id: matchId
      }
    })
  })

  return (
    <div class="p-10 flex gap-6 w-full">
      <SectionWithTitle title={<div class="flex justify-between">
        <span>Teams</span>
        <TeamForm />
      </div>} class="h-min">
        <div class="p-4">
          <For each={teams()}>
            {(team) => (
              <div class="flex gap-4 items-center">
                <img
                  src={team.image_url}
                  alt={team.name}
                  height={50}
                  width={50}
                  class="rounded-xl"
                />
                <span>{team.name}</span>
                <button
                  onclick={() => deleteTeam(team.id)}
                  class="border p-2 border-custom-red-400 text-custom-red-400 rounded-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </For>
        </div>
      </SectionWithTitle>
      <SectionWithTitle
        title={<div class="flex justify-between">
          <span>Matches</span>
          <MatchForm teams={teams()} />
        </div>}
        class="h-min">
        <div class="p-4">
          <For each={matches()}>
            {(match) => (
              <div class="w-full flex gap-2">
                <MatchComponent match={match} />
                <UpdateMatchForm match={match} />
                <button
                  onclick={() => deleteMatch(match.id)}
                  class="border p-2 border-custom-red-400 text-custom-red-400 rounded-lg m-auto"
                >
                  Delete
                </button>
              </div>
            )}
          </For>
        </div>
      </SectionWithTitle>
    </div>
  );
}

function TeamForm() {
  const [creating, { Form }] = createServerAction$(async (form: FormData, event) => {
    const authRequest = auth.handleRequest(event.request)
    const session = await authRequest.validate()
    if (!session || !session.user.isAdmin) {
      return undefined as never
    }
    const name = form.get("teamName") as string;
    const image_url = form.get("image_url") as string;
    await db.team.create({
      data: {
        id: Math.floor(Math.random() * 10000000),
        acronym: name.trim(),
        name: name.trim(),
        slug: name.trim(),
        image_url: image_url,
        isCustom: true,
      },
    })
  }
  )
  const fallback = <span class="border border-custom-purple-text rounded-lg p-2 mx-auto text-custom-purple-text font-semibold text-base">Create Team</span>
  return <Modal
    title={"Create Team"}
    fallBack={fallback}>
    <Form class="p-2 flex flex-col gap-2 pt-4 text-base font-normal">
      <input
        name="teamName"
        placeholder="Team name"
        class="border border-custom-purple-text/50 rounded-lg p-2"
        required
      />
      <input
        name="image_url"
        placeholder="Image Url"
        class="border border-custom-purple-text/50 rounded-lg p-2"
        required
      />
      <button
        type="submit"
        class="border border-custom-purple-text rounded-lg p-2 mx-auto text-custom-purple-text font-semibold"
      >
        Create
      </button>
    </Form>
  </Modal>
}

function MatchForm(props: { teams: Team[] | undefined }) {
  const [creating, { Form }] = createServerAction$(
    async (form: FormData, event) => {
      const authRequest = auth.handleRequest(event.request)
      const session = await authRequest.validate()
      if (!session || !session.user.isAdmin) {
        return undefined as never
      }
      const name = form.get("matchName") as string;
      const nbGames = parseInt(form.get("number_of_games") as string)
      const scheduled_at = form.get("scheduled_at");
      const stream_url = form.get("stream_url") as string
      const team1 = parseInt(form.get("team1") as string)
      const team2 = parseInt(form.get("team2") as string)

      await db.match.create({
        data: {
          id: Math.floor(Math.random() * 1000000),
          name: name,
          number_of_games: nbGames,
          scheduled_at: dayjs(`2023-09-05 ${scheduled_at}`).toDate(),
          slug: name,
          status: "not_started",
          stream: stream_url ?? "https://twitch.tv/4esport_tv",
          league: {
            connect: {
              id: 69696969,
            },
          },
          opponents: {
            connect: [
              {
                id: team1,
              },
              {
                id: team2,
              },
            ],
          },
        },
      });
    }
  );
  const fallback = <span class="border border-custom-purple-text rounded-lg p-2 mx-auto text-custom-purple-text font-semibold text-base">Create Match</span>

  return <Modal
    title="Create Match"
    fallBack={fallback}>
    <Form class="flex flex-col gap-2 pt-4 text-base font-normal">
      <input
        name="matchName"
        placeholder="Match name"
        class="border border-custom-purple-text/50 rounded-lg p-2"
        required
      />
      <input
        name="number_of_games"
        placeholder="Number of games"
        class="border border-custom-purple-text/50 rounded-lg p-2"
        type="number"
        required
      />
      <div class="flex gap-2 items-center">
        <label>Heure de depart</label>
        <input
          name="scheduled_at"
          type="time"
          class="border border-custom-purple-text/50 rounded-lg p-2"
          required
        />
      </div>
      <input
        name="stream_url"
        placeholder="Stream url"
        class="border border-custom-purple-text/50 rounded-lg p-2"
      />
      <div class=" flex gap-2">
        <select name="team1" class="border border-custom-purple-text rounded-lg p-2 mx-auto text-custom-purple-text font-semibold">
          <option value="" selected disabled>Choose team 1</option>
          <For each={props.teams}>
            {(team) => <option value={team.id}>{team.name}</option>}
          </For>
        </select>
        <select name="team2" class="border border-custom-purple-text rounded-lg p-2 mx-auto text-custom-purple-text font-semibold">
          <option value="" selected disabled>Choose team 2</option>
          <For each={props.teams}>
            {(team) => <option value={team.id}>{team.name}</option>}
          </For>
        </select>
      </div>
      <button
        type="submit"
        class="border border-custom-purple-text rounded-lg p-2 ml-auto text-custom-purple-text font-semibold place-self-end"
        disabled={creating.pending}
      >
        Create
      </button>
    </Form>
  </Modal>
}

function UpdateMatchForm(props: { match: (Match & { opponents: Team[] }) }) {
  const [updating, { Form }] = createServerAction$(async (form: FormData, event) => {
    const authRequest = auth.handleRequest(event.request)
    const session = await authRequest.validate()
    if (!session || !session.user.isAdmin) {
      return undefined as never
    }
    const winnerId = parseInt(form.get("winner") as string)
    const matchId = parseInt(form.get("matchId") as string)

    await db.match.update({
      where: {
        id: matchId
      },
      data: {
        status: "finished",
        winner_id: winnerId
      }
    })

    await db.game.create({
      data: {
        id: Math.floor(Math.random() * 1000000),
        match_id: matchId,
        status: "finished",
        winner_id: winnerId,
        complete: true,
        finished: true,
        position: 1,
      }
    })
  })

  const [beginning, begin] = createServerAction$(async (matchId: number, event) => {
    const authRequest = auth.handleRequest(event.request)
    const session = await authRequest.validate()
    if (!session || !session.user.isAdmin) {
      return undefined as never
    }
    await db.match.update({
      where: {
        id: matchId
      },
      data: {
        status: "running"
      }
    })
  })

  const fallBack = <span class="border border-custom-purple-text rounded-lg p-2 mx-auto text-custom-purple-text font-semibold text-base">Update</span>

  return <Modal fallBack={fallBack} title={`Match ${props.match.name}`}>
    <div class="p-2 pt-4 text-base font-normal flex flex-col gap-2">
      <span>Status: {props.match.status}</span>
      <Show when={props.match.status === "not_started"}>
        <button class="border border-custom-purple-text rounded-lg p-2 mx-auto text-custom-purple-text font-semibold" onclick={_ => begin(props.match.id)}>Begin</button>
      </Show>
      <Show when={props.match.status === "running"}>
        <Form class="flex flex-col gap-2 mt-2">
          <input name="matchId" hidden value={props.match.id} />
          <select name="winner">
            <option value="" disabled selected>{"Select winner (this will end the match)"}</option>
            <For each={props.match.opponents}>
              {(team) => <option value={team.id}>{team.name}</option>}
            </For>
          </select>
          <button type="submit" class="border border-custom-purple-text rounded-lg p-2 ml-auto text-custom-purple-text font-semibold place-self-end">Update</button>
        </Form>
      </Show>
    </div>
  </Modal>
}