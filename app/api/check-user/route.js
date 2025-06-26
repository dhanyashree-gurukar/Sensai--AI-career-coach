import { checkUser } from "@/lib/checkUser";

export async function POST() {
  await checkUser();
  return new Response("ok");
}
