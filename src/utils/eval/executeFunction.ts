import { type Context, createContext, runInContext } from "node:vm";

export type ArgType = string | number | boolean | Object;

export interface VMFunctionOptions {
	// Custom context to be merged with the base context
	context?: Record<string, string | number | boolean | Function>;
	// Timeout in milliseconds
	timeout?: number;
	args?: ArgType | Array<ArgType>;
}

/**
 * Safely executes a JavaScript function string in a VM with an isolated context
 * @param fnString JavaScript function as a string
 * @param options Configuration options (context, timeout, and arguments)
 * @returns The result of the function execution
 */
export async function executeFunction(
	fnString: string,
	options: VMFunctionOptions = {},
) {
	const { context = {}, timeout = 5000, args = [] } = options;

	// Create a sandbox with the base context merged with custom context
	const sandbox = {
		console,
		setTimeout,
		clearTimeout,
		setInterval,
		clearInterval,
		...context,
	};

	// Create an isolated context
	const vmContext: Context = createContext(sandbox);

	try {
		// Wrap the function string in an IIFE (Immediately Invoked Function Expression)
		// This allows us to pass arguments and execute the function immediately
		const wrappedCode = `
			(async () => {
				return (${fnString})(...(${JSON.stringify(args)}));
			})()
		`;

		// Execute the code in the isolated context
		return await runInContext(wrappedCode, vmContext, {
			timeout,
			displayErrors: true,
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(`Error executing function in VM: ${error.message}`);
		}
		throw new Error("Unknown error occurred while executing function in VM");
	}
}

// Example usage:
/*
const result = executeFunction(`
  function(x, y) {
    return x + y + (this.customVar || 0);
  }
`, {
  context: { 
    customVar: 100
  },
  args: [10, 20]
}); // returns 130
*/
