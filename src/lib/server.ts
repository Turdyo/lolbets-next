import { ServerError, createServerAction$, createServerData$ } from "solid-start/server";
import { auth } from "./lucia";

export const logoutAction$ = () => createServerAction$(async (_, event) => {
  const authRequest = auth.handleRequest(event.request);
  const session = await authRequest.validate();
  if (!session) {
    throw new ServerError("Unauthorized", {
      status: 401
    })
  }
  await auth.invalidateSession(session.sessionId); // invalidate session
  const sessionCookie = auth.createSessionCookie(null);
  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": sessionCookie.serialize()
    }
  })
})

export const useSession = () => createServerData$(async (_, event) => {
  const authRequest = auth.handleRequest(event.request)
  const session = await authRequest.validate()
  if (!session) {
    return undefined
  }
  return session.user
})