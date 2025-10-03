import { AgentBuilder } from "@iqai/adk";
import { env } from "../../../env";

export const internetSearchAgent = () => {
	return AgentBuilder.create("internet-search-agent")
		.withDescription(
			"An agent that specializes in searching and retrieving information from the internet.",
		)
		.withInstruction(
			`You are an internet search agent. Your role is to search the web for relevant information based on user queries. You should be able to understand the context of the query and find the most pertinent and reliable sources to answer the user's questions effectively. Use search engines and online databases to gather information, and provide concise summaries or direct links to the sources when appropriate.`,
		)
		.withModel(env.LLM_MODEL)
		.build();
};
