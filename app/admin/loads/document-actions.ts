"use server";

import { createClient } from "@/lib/supabase/server";

export async function getRateConfirmationUrl(path: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("load-documents")
    .createSignedUrl(path, 60 * 60); // 1 hour

  if (error) {
    console.error(error);
    return null;
  }

  return data.signedUrl;
}