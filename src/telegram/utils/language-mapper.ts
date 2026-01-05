export type LanguageCode = "en" | "kr" | "zh";

const LANGUAGE_MAP: Record<string, LanguageCode> = {
	english: "en",
	korean: "kr",
	chinese: "zh",
	en: "en",
	kr: "kr",
	zh: "zh",
};

export function mapLanguageToCode(language: string): LanguageCode {
	const normalized = language.toLowerCase().trim();
	return LANGUAGE_MAP[normalized] || "en";
}
