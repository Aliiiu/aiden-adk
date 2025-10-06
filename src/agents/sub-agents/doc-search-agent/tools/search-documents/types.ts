export interface Suggestion {
	id: string;
	title: string;
	metadata?: Array<{
		url: string;
		title: string;
	}> | null;
}

export interface WikiContent {
	title: string;
	content: string;
}

export interface LearnDoc {
	title: string;
	content: string;
}

export interface Source {
	id: string;
	title: string;
	url: string;
}

export interface SearchResult {
	success: true;
	content: string;
	sources: Source[];
	suggestionsCount: number;
	wikiContentsCount: number;
	learnDocsCount: number;
}

export interface SearchError {
	error: string;
}

export interface ExecuteSearchOptions {
	query: string;
}

export interface FormatSearchResultsOptions {
	query: string;
	wikiContents: WikiContent[];
	learnDocs?: LearnDoc[] | null;
	wikiContentMaxSize: number;
	learnDocsMaxSize: number;
}
