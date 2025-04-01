import assert from "node:assert";
import type { ArgType, VMFunctionOptions } from "./executeFunction";
import { executeFunction } from "./executeFunction";

interface ExecuteAssertOptions extends Omit<VMFunctionOptions, "args"> {
	input?: ArgType;
	expected?: ArgType;
}

/**
 * Executes a function with built-in assertions based on input and expected values
 * @param fnString JavaScript function as a string
 * @param options Configuration options including input and expected values
 * @returns The result of the function execution
 */
export async function executeAssert(
	fnString: string,
	options: ExecuteAssertOptions = {},
) {
	const { input, expected, context = {}, ...restOptions } = options;

	// If both input and expected are provided, wrap the function with assertions
	if (input !== undefined && expected !== undefined) {
		const wrappedFn = `
      function () {
        const result = (${fnString})(${JSON.stringify(input)});
        
        // Handle promises
        if (result instanceof Promise) {
          return result.then(actualResult => {
            if (Array.isArray(actualResult) && Array.isArray(${JSON.stringify(expected)})) {
              assert.deepStrictEqual(actualResult, ${JSON.stringify(expected)});
            } else if (typeof actualResult === 'object' && actualResult !== null) {
              assert.deepStrictEqual(actualResult, ${JSON.stringify(expected)});
            } else {
              assert.strictEqual(actualResult, ${JSON.stringify(expected)});
            }
            return actualResult;
          });
        }
        
        // Handle synchronous results
        if (Array.isArray(result) && Array.isArray(${JSON.stringify(expected)})) {
          assert.deepStrictEqual(result, ${JSON.stringify(expected)});
        } else if (typeof result === 'object' && result !== null) {
          assert.deepStrictEqual(result, ${JSON.stringify(expected)});
        } else {
          assert.strictEqual(result, ${JSON.stringify(expected)});
        }
        return result;
      }
    `;

		return executeFunction(wrappedFn, {
			...restOptions,
			context: {
				...context,
				assert,
			},
		});
	}

	// If no assertions are needed, just execute the function normally
	return executeFunction(fnString, {
		...restOptions,
		context: {
			...context,
			assert,
		},
	});
}
