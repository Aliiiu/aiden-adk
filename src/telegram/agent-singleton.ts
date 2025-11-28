import { getRootAgent } from "../agents/agent.js";

type AgentRunner = Awaited<ReturnType<typeof getRootAgent>>["runner"];

let agentRunner: AgentRunner | null = null;

export async function getAgentRunner(): Promise<AgentRunner> {
	if (!agentRunner) {
		console.log("🤖 Initializing AIDEN agent...");
		const { runner } = await getRootAgent();
		agentRunner = runner;
		console.log("✅ Agent ready");
	}
	return agentRunner;
}

export function resetAgent(): void {
	agentRunner = null;
}
