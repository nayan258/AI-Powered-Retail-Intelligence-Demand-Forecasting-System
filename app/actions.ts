"use server";

import { generateBusinessInsight } from "@/lib/ai";

export async function getInsight(context: string) {
  return generateBusinessInsight(context);
}
