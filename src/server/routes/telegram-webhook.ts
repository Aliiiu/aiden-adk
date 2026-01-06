import type { FastifyReply, FastifyRequest } from "fastify";
import type { Telegraf } from "telegraf";
import type { Update } from "telegraf/types";

export function createTelegramWebhookHandler(bot: Telegraf) {
	return async (
		request: FastifyRequest<{ Body: Update }>,
		reply: FastifyReply,
	) => {
		try {
			await bot.handleUpdate(request.body);
			return reply.send({ ok: true });
		} catch (error) {
			console.error("❌ Error handling Telegram update:", error);
			return reply.code(500).send({ ok: false });
		}
	};
}
