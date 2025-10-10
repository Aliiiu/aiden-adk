export function formatData(headers: string[], rows: any[][]): string {
  const headerLine = headers.join("|");
  const dataLines = rows.map(row => row.join("|")).join("\n");
  return `${headerLine}\n${dataLines}`;
}