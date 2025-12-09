/**
 * Code Execution Sandbox
 *
 * Provides a secure environment for executing agent-generated TypeScript code
 * with access to MCP server APIs.
 */

import * as ts from "typescript";
import { VM } from "vm2";
import { createChildLogger } from "../utils/index";

const logger = createChildLogger("Code Execution Sandbox");

export interface SandboxConfig {
	code: string;
	description?: string;
	availableModules?: Record<string, any>;
	timeout?: number;
	memoryLimit?: string;
}

export interface SandboxResult {
	success: boolean;
	result?: any;
	error?: string;
	executionTime?: number;
	consoleOutput?: string[];
}

/**
 * Execute TypeScript code in a sandboxed VM environment
 */
export async function executeInSandbox(
	config: SandboxConfig,
): Promise<SandboxResult> {
	const startTime = Date.now();
	const consoleOutput: string[] = [];

	try {
		const validation = validateCode(config.code);
		if (!validation.valid) {
			return {
				success: false,
				error: `Code validation failed: ${validation.reason}`,
				executionTime: Date.now() - startTime,
			};
		}

		const syntaxCheck = checkTypeScriptSyntax(config.code);
		if (!syntaxCheck.valid) {
			logger.error("TypeScript syntax errors detected:", syntaxCheck.errors);
			return {
				success: false,
				error: `TypeScript syntax error: ${syntaxCheck.errors?.join("; ")}`,
				executionTime: Date.now() - startTime,
			};
		}

		logger.info("Transpiling TypeScript code...");
		const jsCode = ts.transpile(config.code, {
			target: ts.ScriptTarget.ES2020,
			module: ts.ModuleKind.CommonJS,
			esModuleInterop: true,
			allowSyntheticDefaultImports: true,
		});

		logger.info("Code transpilation completed.");

		// Create sandbox environment
		const sandbox: any = {
			module: { exports: {} },
			exports: {},
			require: (modulePath: string) => {
				if (config.availableModules?.[modulePath]) {
					logger.debug(`Loading module: ${modulePath}`);
					return config.availableModules[modulePath];
				}
				throw new Error(
					`Module '${modulePath}' is not available in sandbox. Available modules: ${Object.keys(config.availableModules || {}).join(", ")}`,
				);
			},
			Promise: Promise,
			setTimeout: setTimeout,
			clearTimeout: clearTimeout,
		};

		const vm = new VM({
			timeout: config.timeout || 30000,
			sandbox,
			eval: false,
			wasm: false,
		});

		const result = await vm.run(`
			(async () => {
				${jsCode}
			})()
		`);

		const executionTime = Date.now() - startTime;
		logger.info(`Code execution completed in ${executionTime}ms`);
		logger.debug(
			`Result value: ${result === undefined ? "undefined" : "has value"}`,
		);

		// Short-circuit before serialization for clearer error messaging
		if (result === undefined) {
			return {
				success: false,
				error:
					"Code execution returned undefined. Ensure your script ends with: return { summary: string, data: any }.",
				executionTime,
				consoleOutput: consoleOutput.length > 0 ? consoleOutput : undefined,
			};
		}

		// Serialize result to ensure it's cloneable and remove any non-serializable objects
		let serializedResult: any;
		try {
			// JSON.parse(JSON.stringify()) removes functions, symbols, and other non-serializable data
			serializedResult = JSON.parse(JSON.stringify(result));
		} catch (serializationError) {
			logger.warn(
				"Result contains non-serializable data, returning as string:",
				serializationError,
			);
			serializedResult = String(result);
			logger.info("Result (as string):", serializedResult);
		}

		return {
			success: true,
			result: serializedResult,
			executionTime,
			consoleOutput: consoleOutput.length > 0 ? consoleOutput : undefined,
		};
	} catch (error) {
		const executionTime = Date.now() - startTime;
		const errorMessage = error instanceof Error ? error.message : String(error);

		logger.error(`Code execution failed after ${executionTime}ms:`, error);

		return {
			success: false,
			error: errorMessage,
			executionTime,
			consoleOutput: consoleOutput.length > 0 ? consoleOutput : undefined,
		};
	}
}

/**
 * Check TypeScript syntax using the compiler API
 * Only checks for SYNTAX errors (like unterminated strings), not TYPE errors
 */
function checkTypeScriptSyntax(code: string): {
	valid: boolean;
	errors?: string[];
} {
	try {
		const sourceFile = ts.createSourceFile(
			"sandbox.ts",
			code,
			ts.ScriptTarget.ES2020,
			true,
		);

		const errors: string[] = [];

		// Get only syntactic diagnostics (not semantic/type errors)
		const syntaxDiagnostics = (sourceFile as any).parseDiagnostics || [];

		for (const diagnostic of syntaxDiagnostics) {
			if (diagnostic.category === ts.DiagnosticCategory.Error) {
				if (diagnostic.file && diagnostic.start !== undefined) {
					const { line, character } =
						diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
					const message = ts.flattenDiagnosticMessageText(
						diagnostic.messageText,
						"\n",
					);
					errors.push(`Line ${line + 1}:${character + 1} - ${message}`);
				} else {
					errors.push(
						ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
					);
				}
			}
		}

		// Also check for specific syntax issues by walking the tree
		function visit(node: ts.Node) {
			// Unknown nodes indicate parsing failures
			if (node.kind === ts.SyntaxKind.Unknown) {
				errors.push(`Unexpected syntax at position ${node.pos}`);
			}
			ts.forEachChild(node, visit);
		}

		visit(sourceFile);

		if (errors.length > 0) {
			return { valid: false, errors };
		}

		return { valid: true };
	} catch (error) {
		logger.warn(
			"Syntax checking failed, proceeding with transpilation:",
			error,
		);
		return { valid: true };
	}
}

/**
 * Validate code for dangerous patterns before execution using AST analysis
 */
function validateCode(code: string): { valid: boolean; reason?: string } {
	try {
		// Parse code into AST for structural analysis
		const sourceFile = ts.createSourceFile(
			"sandbox.ts",
			code,
			ts.ScriptTarget.ES2020,
			true,
		);

		// Forbidden identifiers that indicate dangerous operations
		const forbiddenGlobals = new Set([
			"eval",
			"Function",
			"__dirname",
			"__filename",
		]);

		// Forbidden module imports
		const forbiddenModules = new Set([
			"fs",
			"fs/promises",
			"child_process",
			"net",
			"http",
			"https",
			"os",
			"cluster",
			"dgram",
			"dns",
			"tls",
			"crypto",
			"worker_threads",
			"vm",
			"vm2",
		]);

		// Forbidden property accesses on process object
		const forbiddenProcessAccess = new Set(["exit", "env", "kill", "abort"]);

		const violations: string[] = [];

		function visit(node: ts.Node) {
			if (ts.isCallExpression(node)) {
				const callExpr = node as ts.CallExpression;
				if (
					ts.isIdentifier(callExpr.expression) &&
					callExpr.expression.text === "eval"
				) {
					violations.push("eval() function is not allowed");
				}
			}

			// Check for Function constructor: new Function() or Function()
			if (ts.isNewExpression(node) || ts.isCallExpression(node)) {
				const expr = node as ts.NewExpression | ts.CallExpression;
				if (
					ts.isIdentifier(expr.expression) &&
					expr.expression.text === "Function"
				) {
					violations.push("Function constructor is not allowed");
				}
			}

			// Check for forbidden global identifiers
			if (ts.isIdentifier(node)) {
				if (forbiddenGlobals.has(node.text)) {
					violations.push(`Use of '${node.text}' is not allowed`);
				}
			}

			// Check for process.* access
			if (ts.isPropertyAccessExpression(node)) {
				const propAccess = node as ts.PropertyAccessExpression;
				if (
					ts.isIdentifier(propAccess.expression) &&
					propAccess.expression.text === "process"
				) {
					const propertyName = propAccess.name.text;
					if (forbiddenProcessAccess.has(propertyName)) {
						violations.push(`process.${propertyName} is not allowed`);
					}
				}
			}

			// Check for require() calls with forbidden modules
			if (ts.isCallExpression(node)) {
				const callExpr = node as ts.CallExpression;
				if (
					ts.isIdentifier(callExpr.expression) &&
					callExpr.expression.text === "require"
				) {
					if (callExpr.arguments.length > 0) {
						const arg = callExpr.arguments[0];
						if (ts.isStringLiteral(arg)) {
							const moduleName = arg.text;
							if (forbiddenModules.has(moduleName)) {
								violations.push(
									`Import of '${moduleName}' module is not allowed`,
								);
							}
						}
					}
				}
			}

			// Check for import declarations
			if (ts.isImportDeclaration(node)) {
				const importDecl = node as ts.ImportDeclaration;
				if (ts.isStringLiteral(importDecl.moduleSpecifier)) {
					const moduleName = importDecl.moduleSpecifier.text;
					if (forbiddenModules.has(moduleName)) {
						violations.push(`Import of '${moduleName}' module is not allowed`);
					}
				}
			}

			// Check for dynamic import() expressions
			if (ts.isCallExpression(node)) {
				const callExpr = node as ts.CallExpression;
				if (callExpr.expression.kind === ts.SyntaxKind.ImportKeyword) {
					violations.push("Dynamic import() is not allowed");
				}
			}

			ts.forEachChild(node, visit);
		}

		visit(sourceFile);

		if (violations.length > 0) {
			return {
				valid: false,
				reason: violations.join("; "),
			};
		}

		return { valid: true };
	} catch (error) {
		logger.error("AST-based validation failed:", error);
		// Fallback to basic validation if AST parsing fails
		return fallbackStringValidation(code);
	}
}

/**
 * Fallback string-based validation if AST parsing fails
 */
function fallbackStringValidation(code: string): {
	valid: boolean;
	reason?: string;
} {
	const forbiddenPatterns = [
		{ pattern: "eval(", reason: "eval() is not allowed" },
		{ pattern: "Function(", reason: "Function constructor is not allowed" },
		{
			pattern: 'require("fs")',
			reason: "File system access is not allowed",
		},
		{
			pattern: 'require("child_process")',
			reason: "Child process spawning is not allowed",
		},
		{ pattern: "process.exit", reason: "Process exit is not allowed" },
		{
			pattern: "process.env",
			reason: "Environment variable access is not allowed",
		},
		{ pattern: "__dirname", reason: "Directory access is not allowed" },
		{ pattern: "__filename", reason: "File access is not allowed" },
	];

	for (const { pattern, reason } of forbiddenPatterns) {
		if (code.includes(pattern)) {
			return { valid: false, reason };
		}
	}

	const importRegex = /(?:import|require)\s*\(?['"]([^'"]+)['"]\)?/g;
	const imports = [...code.matchAll(importRegex)].map((match) => match[1]);

	const suspiciousImports = imports.filter(
		(imp) =>
			imp.startsWith("fs") ||
			imp.startsWith("child_process") ||
			imp.startsWith("net") ||
			imp.startsWith("http") ||
			imp.startsWith("https"),
	);

	if (suspiciousImports.length > 0) {
		return {
			valid: false,
			reason: `Suspicious imports detected: ${suspiciousImports.join(", ")}`,
		};
	}

	return { valid: true };
}

/**
 * Helper to create a module from exported functions
 */
export function createModule(exports: Record<string, any>) {
	return { ...exports, default: exports };
}
