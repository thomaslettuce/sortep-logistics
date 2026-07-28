"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitApplication(formData: FormData) {
  const supabase = await createClient();

  const fullName = (formData.get("fullName") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim().toLowerCase() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const cdl = (formData.get("cdl") as string)?.trim() || null;
  const experience = (formData.get("experience") as string)?.trim() || null;
  const message = (formData.get("message") as string)?.trim() || null;

  if (!fullName || !email || !phone) {
    throw new Error("Full name, email, and phone are required");
  }

  const { error } = await supabase.from("applications").insert({
    full_name: fullName,
    email,
    phone,
    cdl,
    experience,
    message,
    status: "new",
  });

  if (error) {
    console.error("Failed to submit application:", error);
    throw new Error("Failed to submit application");
  }

  revalidatePath("/apply");
  redirect("/apply?submitted=1");
}