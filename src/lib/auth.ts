import { cookies } from "next/headers";
import { getUser, createUser } from "@/lib/data/store";

export const SESSION_COOKIE = "qwizo_uid";

export async function getCurrentUserId(): Promise<string | null> {
  const c = await cookies();
  return c.get(SESSION_COOKIE)?.value || null;
}

export async function getCurrentUser() {
  const id = await getCurrentUserId();
  if (!id) return null;
  return getUser(id) || null;
}

export function signInAs(userId: string) {
  // client helper sets cookie via document.cookie
}

export function ensureDemoUser() {
  if (!getUser("u-demo")) {
    createUser({ id: "u-demo", username: "demo", displayName: "Demo Learner", interests: ["t-js", "t-react"] });
  }
  return "u-demo";
}

