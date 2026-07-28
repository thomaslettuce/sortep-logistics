"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function submitApplication(formData: FormData) {
  const supabase = await createClient();

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const cdl = formData.get("cdl") as string;
  const experience = formData.get("experience") as string;
  const message = formData.get("message") as string;

  const { error } = await supabase.from("applications").insert({
    full_name: fullName,
    email,
    phone,
    cdl: cdl || null,
    experience: experience || null,
    message: message || null,
  });

  if (error) {
    console.error("Error submitting application:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }

  redirect("/apply/success");
}