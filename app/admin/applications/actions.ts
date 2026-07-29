"use server";

import { logActivity } from "@/lib/activity-log";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) redirect("/auth/login");

  const { data: driver } = await supabase
    .from("drivers")
    .select("role")
    .eq("user_id", authData.user.id)
    .single();

  if (!driver || driver.role !== "admin") {
    redirect("/admin");
  }

  return supabase;
}

export async function rejectApplication(formData: FormData) {
  const supabase = await requireAdmin();
  const applicationId = formData.get("applicationId") as string;

  await supabase
    .from("applications")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  await logActivity({
    action: "reject",
    entityType: "application",
    entityId: applicationId,
    summary: `Rejected application ${applicationId}`,
  });

  revalidatePath("/admin/applications");
  revalidatePath("/admin/drivers");
}

export async function acceptApplication(formData: FormData) {
  const supabase = await requireAdmin();
  const applicationId = formData.get("applicationId") as string;
  const tempPassword = (formData.get("temp_password") as string) || "";

  if (!tempPassword || tempPassword.length < 6) {
    throw new Error("Temporary password must be at least 6 characters");
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing in .env.local");
  }

  const { data: application, error: appError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (appError || !application) {
    throw new Error("Application not found");
  }

  if (application.status === "accepted") {
    redirect("/admin/applications?error=already_accepted");
  }

  const email = (application.email || "").trim().toLowerCase();
  if (!email) {
    throw new Error("Application has no email");
  }

  const adminClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // Create auth user
  const { data: created, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: application.full_name,
        role: "driver",
      },
    });

  if (createError || !created.user) {
    console.error(createError);
    throw new Error(createError?.message || "Failed to create login account");
  }

  // Create driver profile
  const { error: driverError } = await adminClient.from("drivers").insert({
    user_id: created.user.id,
    email,
    full_name: application.full_name || null,
    phone: application.phone || null,
    status: "approved",
    role: "driver",
    employment_type: "company_driver",
  });

  if (driverError) {
    console.error(driverError);
    throw new Error(
      "Login was created, but driver profile failed: " + driverError.message
    );
  }

  await supabase
    .from("applications")
    .update({
      status: "accepted",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  await logActivity({
    action: "accept",
    entityType: "application",
    entityId: applicationId,
    summary: `Accepted application for ${email} and created driver`,
  });

  revalidatePath("/admin/applications");
  revalidatePath("/admin/drivers");
  redirect("/admin/applications?accepted=1");
}