import { auth, discordAuth } from "~/lib/lucia";
import { redirect } from "solid-start";
import { serializeCookie } from "solid-start";

import type { APIEvent } from "solid-start";

export const GET = async (event: APIEvent) => {
	const authRequest = auth.handleRequest(event.request);
	const session = await authRequest.validate();
	if (session) {
		return redirect("/", 302); // redirect to profile page
	}
	const [url, state] = await discordAuth.getAuthorizationUrl();
	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString(),
			"Set-Cookie": serializeCookie("discord_oauth_state", state, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				path: "/",
				maxAge: 60 * 60
			})
		}
	});
};