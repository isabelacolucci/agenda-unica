"use server";

import { revalidatePath } from "next/cache";

export async function revalidateConfig() {
  revalidatePath("/dashboard/config");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard/schedule");
}
