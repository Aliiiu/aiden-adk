/**
 * Truncate document content to fit within size limits
 */
export function truncateDocumentContent(
	content: string,
	maxSizeBytes: number,
): string {
	const encoder = new TextEncoder();
	const encodedContent = encoder.encode(content);
	const contentSizeBytes = encodedContent.length;

	if (contentSizeBytes <= maxSizeBytes) {
		return content;
	}

	if (contentSizeBytes === 0) {
		return "Content is empty or not available.";
	}

	console.warn(
		`📏 Document content exceeds ${Math.round(maxSizeBytes / 1024)}KB, truncating...`,
	);

	const targetSize = Math.floor(maxSizeBytes * 0.9);
	let truncatedContent = new TextDecoder().decode(
		encodedContent.slice(0, targetSize),
	);

	const lastSpaceIndex = truncatedContent.lastIndexOf(" ");
	if (lastSpaceIndex > truncatedContent.length * 0.9) {
		truncatedContent = truncatedContent.substring(0, lastSpaceIndex);
	}

	return `${truncatedContent}\n\n[Content truncated due to size limit - original size: ${Math.round(contentSizeBytes / 1024)}KB]`;
}
