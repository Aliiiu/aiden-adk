export function formatData<T>(headers: string[], rows: T[][]): string {
	const headerLine = headers.join("|");
	const dataLines = rows.map((row) => row.join("|")).join("\n");
	return `${headerLine}\n${dataLines}`;
}
