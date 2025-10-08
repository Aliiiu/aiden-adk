import type { ReadonlyContext } from "@iqai/adk";

/**
 * Injects session state values into an instruction template.
 * Replaces {variable_name} placeholders with values from session state.
 */
export function injectSessionState(
	template: string,
	readonlyContext: ReadonlyContext,
): string {
	const sessionState = readonlyContext.state;

	/**
	 * Replaces a single template variable match
	 */
	function replaceMatch(match: string): string {
		const varName = match.replace(/[{}]/g, "").trim();

		if (varName in sessionState) {
			const value = String(sessionState[varName]);
			return value;
		}

		// If variable not found, return original placeholder
		return match;
	}

	// Replace all template variables using the pattern {variable_name}
	return template.replace(/{[^{}]*}/g, replaceMatch);
}
