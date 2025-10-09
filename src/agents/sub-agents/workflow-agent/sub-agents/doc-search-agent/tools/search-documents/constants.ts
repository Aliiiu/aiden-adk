export const WIKI_GRAPHQL_ENDPOINT = "https://api.iq.wiki/graphql";

export const SEARCH_QUERY = `
  query Search($query: String!, $withAnswer: Boolean) {
    search(query: $query, withAnswer: $withAnswer) {
      suggestions {
        id
        title
        metadata {
          url
          title
        }
      }
      wikiContents {
        title
        content
      }
      learnDocs {
        title
        content
      }
    }
  }
`;

export const DEFAULT_WIKI_CONTENT_MAX_SIZE = 40 * 1024; // 40KB
export const DEFAULT_LEARN_DOCS_MAX_SIZE = 30 * 1024; // 30KB
