import type { Context } from "telegraf";
import { getAgentRunner } from "./agent-singleton.js";

const MESSAGE_FOOTER = '\n\n🧠 Powered by <a href="https://aiden.id">AIDEN</a>';
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
	const options = {
		parse_mode: "HTML" as const,
		disable_web_page_preview: true,
	};

	if (text.length > MAX_MESSAGE_LENGTH) {
		const chunks =
			text.match(new RegExp(`.{1,${MAX_MESSAGE_LENGTH}}`, "g")) || [];
		for (const chunk of chunks) {
			await ctx.reply(chunk, options);
		}
	} else {
		await ctx.reply(text, options);
	}
}
