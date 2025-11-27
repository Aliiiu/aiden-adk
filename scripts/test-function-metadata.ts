/**
 * Function Metadata Test Script
 *
 * Validates that all MCP wrapper functions have:
 * - Structured parameter extraction from Zod schemas
 * - @example JSDoc blocks for agent guidance
 *
 * Modules tested: CoinGecko, DeBank, DeFiLlama, IQ.ai
 *
 * Usage:
 *   pnpm run test:metadata
 *
 * Exit codes:
 *   0 - All functions pass
 *   1 - One or more functions missing params or examples
 */

import type { FunctionMetadata } from "../src/lib/function-index/builder.js";
import { buildFunctionIndex } from "../src/lib/function-index/builder.js";

interface ModuleStats {
	total: number;
	withParams: number;
	withExample: number;
}

interface TestStats {
	total: number;
	withParameters: number;
	withoutParameters: number;
	withExample: number;
	withoutExample: number;
	byModule: Map<string, ModuleStats>;
}

interface FailedFunction {
	func: FunctionMetadata;
	missingParams: boolean;
	missingExample: boolean;
}

function hasStructuredParams(func: FunctionMetadata): boolean {
	return (
		func.parameters !== undefined &&
		func.parameters !== "see JSDoc @param tags in description field"
	);
}

function hasExample(func: FunctionMetadata): boolean {
	return !!func.example;
}

function analyzeFunctions(documents: Map<string, FunctionMetadata>): {
	stats: TestStats;
	failedFunctions: FailedFunction[];
} {
	const stats: TestStats = {
		total: 0,
		withParameters: 0,
		withoutParameters: 0,
		withExample: 0,
		withoutExample: 0,
		byModule: new Map(),
	};

	const failedFunctions: FailedFunction[] = [];
	const moduleMap = new Map<string, FunctionMetadata[]>();

	// Group functions by module
	for (const func of documents.values()) {
		if (!moduleMap.has(func.module)) {
			moduleMap.set(func.module, []);
		}
		moduleMap.get(func.module)?.push(func);
	}

	// Analyze each module
	for (const [module, functions] of moduleMap.entries()) {
		const moduleStats: ModuleStats = {
			total: 0,
			withParams: 0,
			withExample: 0,
		};

		for (const func of functions) {
			stats.total++;
			moduleStats.total++;

			const hasParams = hasStructuredParams(func);
			const hasEx = hasExample(func);

			if (hasParams) {
				stats.withParameters++;
				moduleStats.withParams++;
			} else {
				stats.withoutParameters++;
			}

			if (hasEx) {
				stats.withExample++;
				moduleStats.withExample++;
			} else {
				stats.withoutExample++;
			}

			// Track functions that don't pass
			if (!hasParams || !hasEx) {
				failedFunctions.push({
					func,
					missingParams: !hasParams,
					missingExample: !hasEx,
				});
			}
		}

		stats.byModule.set(module, moduleStats);
	}

	return { stats, failedFunctions };
}

function displayFailedFunctions(
	failedFunctions: FailedFunction[],
	total: number,
): void {
	if (failedFunctions.length > 0) {
		console.log(
			`⚠️  Functions with issues (${failedFunctions.length}/${total}):\n`,
		);

		for (const { func, missingParams, missingExample } of failedFunctions) {
			const issues: string[] = [];
			if (missingParams) issues.push("params");
			if (missingExample) issues.push("example");

			console.log(
				`  • ${func.name} (${func.module}/${func.category}) - Missing: ${issues.join(", ")}`,
			);
		}
		console.log();
	} else {
		console.log(`✅ All functions pass!\n`);
	}
}

function calculatePercentage(value: number, total: number): number {
	if (total > 0) {
		return Math.round((value / total) * 100);
	}
	return 0;
}

function displayOverallStats(stats: TestStats): void {
	console.log(`${"━".repeat(80)}`);
	console.log(`  OVERALL STATISTICS`);
	console.log(`${"━".repeat(80)}\n`);
	console.log(`  Total functions: ${stats.total}`);
	console.log(
		`  Structured parameters: ${stats.withParameters}/${stats.total} (${calculatePercentage(stats.withParameters, stats.total)}%)`,
	);
	console.log(
		`  Examples: ${stats.withExample}/${stats.total} (${calculatePercentage(stats.withExample, stats.total)}%)`,
	);
}

function displayModuleBreakdown(stats: TestStats): void {
	console.log(`\n${"━".repeat(80)}`);
	console.log(`  MODULE BREAKDOWN`);
	console.log(`${"━".repeat(80)}\n`);

	for (const [module, moduleStats] of stats.byModule.entries()) {
		const paramsPercent = calculatePercentage(
			moduleStats.withParams,
			moduleStats.total,
		);
		const examplesPercent = calculatePercentage(
			moduleStats.withExample,
			moduleStats.total,
		);
		const paramsIcon = paramsPercent === 100 ? "✅" : "⚠️";
		const examplesIcon = examplesPercent === 100 ? "✅" : "⚠️";

		console.log(`  ${module.toUpperCase()}:`);
		console.log(`    Total: ${moduleStats.total}`);
		console.log(
			`    ${paramsIcon} Params: ${moduleStats.withParams}/${moduleStats.total} (${paramsPercent}%)`,
		);
		console.log(
			`    ${examplesIcon} Examples: ${moduleStats.withExample}/${moduleStats.total} (${examplesPercent}%)\n`,
		);
	}
}

function runTest(): void {
	console.log("Building function index...\n");
	const { documents } = buildFunctionIndex();

	console.log(`${"━".repeat(80)}`);
	console.log(`  PARAMETER EXTRACTION TEST RESULTS`);
	console.log(`${"━".repeat(80)}\n`);

	const { stats, failedFunctions } = analyzeFunctions(documents);

	displayFailedFunctions(failedFunctions, stats.total);
	displayOverallStats(stats);
	displayModuleBreakdown(stats);

	console.log(`${"━".repeat(80)}`);
	console.log(`  ✨ Test complete\n`);

	process.exit(failedFunctions.length > 0 ? 1 : 0);
}

// Run the test
runTest();
