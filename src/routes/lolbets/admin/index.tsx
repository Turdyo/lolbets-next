import { Team } from "@prisma/client";
import dayjs from "dayjs";
import { For } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
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
      return redirect("/lolbets") as never;
    }
    return session.user;
  });

  const teams = createServerData$(() =>
    db.team.findMany({
      where: {
        isCustom: true,
      },
    })
  );

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
        },
      },
    });
    return league?.match;
  });

  return { teams, matches };
}

export default function Admin() {
  const { teams, matches } = useRouteData<typeof routeData>();

  const [deleting, deleteTeam] = createServerAction$((teamId: number, _) =>
    db.team.delete({
      where: {
        id: teamId,
      },
    })
  );

  const [deleting2, deleteMatch] = createServerAction$((matchId: number, _) =>
    db.match.delete({
      where: {
        id: matchId,
      },
    })
  );

  return (
    <div class="p-10 flex gap-6 w-full">
      <div class="flex flex-col justify-between">
        <TeamForm />
        <MatchForm teams={teams()} />
      </div>
      <SectionWithTitle title={"Teams"} class="h-">
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
      <SectionWithTitle title={"Matches"} class="h-min">
        <div class="p-4">
          <For each={matches()}>
            {(match) => (
              <div class="w-full flex gap-2">
                <MatchComponent match={match} />
                <button
                  onclick={() => deleteMatch(match.id)}
                  class="border p-2 border-custom-red-400 text-custom-red-400 rounded-lg"
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
  const [creating, { Form }] = createServerAction$(
    async (form: FormData, { request }) => {
      const name = form.get("teamName") as string;
      const image_url = form.get("image_url") as string;
      await db.team.create({
        data: {
          id: Math.floor(Math.random() * 1000000),
          acronym: name.trim(),
          name: name.trim(),
          slug: name.trim(),
          image_url: image_url,
          isCustom: true,
        },
      });
    }
  );
  return (
    <div class="basis-1/3">
      <Form class="p-2 flex flex-col gap-2">
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
    </div>
  );
}

function MatchForm(props: { teams: Team[] | undefined }) {
  const [creating, { Form }] = createServerAction$(
    async (form: FormData, { request }) => {
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

  return (
    <div>
      <Form class="flex flex-col gap-2">
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
          class="border border-custom-purple-text rounded-lg p-2 mx-auto text-custom-purple-text font-semibold"
        >
          Create
        </button>
      </Form>
      <Modal />
    </div>
  );
}
