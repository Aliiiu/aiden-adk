import { randomUUID } from "node:crypto";
import { getSharedAgentBuilder } from "../lib/agent-builder-cache";

type AgentRunner = Awaited<
	ReturnType<
		ReturnType<
			Awaited<ReturnType<typeof getSharedAgentBuilder>>["withQuickSession"]
		>["build"]
	>
>["runner"];

export async function getAgentRunner(): Promise<AgentRunner> {
	const builder = await getSharedAgentBuilder();

	const initialState = {
		query: null,
		detectedLanguage: null,
		processedQuery: null,
		documentContext: null,
		isTelegramRequest: true,
		isTwitterRequest: false,
	};

	const { runner } = await builder
		.withQuickSession({
			state: initialState,
			sessionId: randomUUID(),
			appName: "telegram-bot",
		})
		.build();

	return runner;
}
