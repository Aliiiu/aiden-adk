import type { Context } from "telegraf";
import { getAgentRunner } from "./agent-singleton.js";

const MESSAGE_FOOTER = "\n\n🧠 Powered by [AIDEN](https://aiden.id)";
const MAX_MESSAGE_LENGTH = 4000;

export async function processQuery(
	ctx: Context,
	query: string,
	context: string | null = null,
): Promise<void> {
	try {
		await ctx.sendChatAction("typing");

		const runner = await getAgentRunner();

		const fullPrompt = context
			? `Context: "${context}"\n\nQuestion: ${query}`
			: query;

		const response = await runner.ask(fullPrompt);

		const workflowAgentResponse = response.find(
			(r) => r.agent === "workflow_agent",
		)?.response;

		if (workflowAgentResponse) {
			const replyText =
				typeof workflowAgentResponse === "string"
					? workflowAgentResponse
					: JSON.stringify(workflowAgentResponse, null, 2);

			await sendLongMessage(ctx, replyText + MESSAGE_FOOTER);
		} else {
			await ctx.reply("I'm sorry, I couldn't process your request.");
		}
	} catch (error) {
		console.error("Error processing message:", error);
		await ctx.reply(
			"Sorry, something went wrong while processing your request.",
		);
	}
}

async function sendLongMessage(ctx: Context, text: string): Promise<void> {
	if (text.length > MAX_MESSAGE_LENGTH) {
		const chunks =
			text.match(new RegExp(`.{1,${MAX_MESSAGE_LENGTH}}`, "g")) || [];
		for (const chunk of chunks) {
			await ctx.reply(chunk, { parse_mode: "Markdown" });
		}
	} else {
		await ctx.reply(text, { parse_mode: "Markdown" });
	}
}
