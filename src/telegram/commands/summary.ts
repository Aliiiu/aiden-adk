import type { Context } from "telegraf";
import { processQuery } from "../handlers";

export async function handleSummary(ctx: Context): Promise<void> {
	await processQuery(ctx, "Please provide a summary of the current context.");
}
