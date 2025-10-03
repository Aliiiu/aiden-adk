import { AgentBuilder } from "@iqai/adk";
import { env } from "../../../env";

export const getDocumentSearchAgent = () => {
	return AgentBuilder.create("doc-search-agent")
		.withDescription(
			"An agent that specializes in searching and retrieving information from documents.",
		)
		.withInstruction(
			`You are a document search agent. Your role is to search through provided documents and retrieve relevant information based on user queries. You should be able to understand the context of the query and find the most pertinent sections of the documents to answer the user's questions effectively.`,
		)
		.withModel(env.LLM_MODEL)
		.build();
};
