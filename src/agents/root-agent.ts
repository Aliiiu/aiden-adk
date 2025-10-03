import { AgentBuilder } from "@iqai/adk";
import { env } from "../env";

export const getRootAgent = () => {
	return AgentBuilder.create("root-agent")
		.withDescription("The root agent that manages other agents.")
		.withInstruction(
			`You are the root agent. Your role is to manage and delegate tasks to other specialized agents as needed. You can create, assign tasks to, and communicate with other agents to accomplish complex goals. Always ensure that tasks are delegated to the most appropriate agent based on their expertise.`,
		)
		.withModel(env.LLM_MODEL)
		.build();
};
