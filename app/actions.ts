"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { normalizeMessage } from "../lib/messages";
import { addMessage } from "../lib/supabase";

export async function submitMessage(formData: FormData) {
  try {
    const message = normalizeMessage(String(formData.get("message") ?? ""));
    await addMessage(message);
    revalidatePath("/");
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Could not save the message";
    redirect(`/?error=${encodeURIComponent(reason)}`);
  }

  redirect("/?sent=1");
}
