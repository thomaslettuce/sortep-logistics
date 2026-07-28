"use server";

import { createClient } from "@/lib/supabase/server";

type LogInput = {
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Record<string, unknown>;
};

export async function logActivity({
  action,
  entityType,
  entityId,
  summary,
  metadata,
}: LogInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("activity_logs").insert({
    actor_user_id: user?.id ?? null,
    actor_email: user?.email ?? null,
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    summary,
    metadata: metadata ?? null,
  });
}