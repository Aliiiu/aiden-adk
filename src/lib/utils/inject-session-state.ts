import type { ReadonlyContext } from "@iqai/adk";

/**
 * Injects session state values into an instruction template.
 * Replaces {variable_name} placeholders with values from session state.
 */
export async function injectSessionState(
	template: string,
	readonlyContext: ReadonlyContext,
): Promise<string> {
	const invocationContext = (readonlyContext as any)._invocationContext;

	/**
	 * Replaces a single template variable match
	 */
	function replaceMatch(match: string): string {
		const varName = match.replace(/[{}]/g, "").trim();

		const sessionState = invocationContext.session.state;
		if (varName in sessionState) {
			return String(sessionState[varName]);
		}

		// If variable not found, return original placeholder
		return match;
	}

	// Replace all template variables using the pattern {variable_name}
	return template.replace(/{[^{}]*}/g, replaceMatch);
}
