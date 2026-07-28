"use server";

import { logActivity } from "@/lib/activity-log";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAdminUser(formData: FormData) {
  const supabase = await createServerClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) redirect("/auth/login");

  const { data: currentDriver } = await supabase
    .from("drivers")
    .select("role")
    .eq("user_id", authData.user.id)
    .single();

  if (!currentDriver || currentDriver.role !== "admin") {
    redirect("/portal");
  }

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const fullName = (formData.get("full_name") as string)?.trim() || null;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing in .env.local. Add it and restart the server."
    );
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data: created, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: "admin",
      },
    });

  if (createError || !created.user) {
    console.error("Create admin auth error:", createError);
    throw new Error(createError?.message || "Failed to create admin user");
  }

  const { error: driverError } = await adminClient.from("drivers").insert({
    user_id: created.user.id,
    email,
    full_name: fullName,
    status: "approved",
    role: "admin",
    employment_type: "company_driver",
  });

  if (driverError) {
    console.error("Create admin driver row error:", driverError);
    throw new Error(
      "Admin auth user was created, but driver/admin profile insert failed: " +
        driverError.message
    );
  }

  await logActivity({
    action: "create",
    entityType: "admin",
    entityId: created.user.id,
    summary: `Created admin user ${email}`,
  });

  revalidatePath("/admin/settings");
  revalidatePath("/admin/drivers");
  revalidatePath("/admin/activity");
  redirect("/admin/settings?admin_created=1");
}