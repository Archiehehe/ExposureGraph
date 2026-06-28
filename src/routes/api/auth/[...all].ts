import { toSolidStartHandler } from "better-auth/solid-start";
import { auth } from "../../../lib/auth";

if (!auth) {
  throw new Error(
    "Auth is not configured. Set BETTER_AUTH_SECRET, BETTER_AUTH_URL, GOOGLE_CLIENT_ID, and GOOGLE_CLIENT_SECRET."
  );
}

export const { GET, POST } = toSolidStartHandler(auth);
