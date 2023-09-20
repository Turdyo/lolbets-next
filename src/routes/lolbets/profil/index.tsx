import { useRouteData } from "solid-start"
import { createServerData$, redirect } from "solid-start/server"
import { SectionWithTitle } from "~/components/ui/SectionWithTitle"
import { db } from "~/db/prisma"
import { auth } from "~/lib/lucia"

export function routeData() {
  const user = createServerData$(async (_, event) => {
    const authRequest = auth.handleRequest(event.request);
    const session = await authRequest.validate();
    if (!session) {
      return redirect("/lolbets") as never
    }
    return session.user
  })

  const betHistory = createServerData$(async ([id]) => {
    return db.bet.findMany({
      where: {
        userId: id
      }
    })
  }, {key: () => [user()?.discordId]})

  return { user, betHistory }
}

export default function Page() {
  const { betHistory, user } = useRouteData<typeof routeData>()
  return <div>
    <SectionWithTitle title={"Profil"}>
      {user()?.name}
    </SectionWithTitle>
  </div>
}