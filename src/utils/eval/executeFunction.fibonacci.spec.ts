import { describe, expect, it } from "vitest";
import { executeFunction } from "./executeFunction";

describe("VM Function Execution - Fibonacci", () => {
	const fibonacciFunction = `
    function fibonacci(n) {
      // Check if the input is a valid number
      if (n < 0) return 'Input must be a non-negative integer';
      if (n === 0) return 0; // Base case for 0
      if (n === 1) return 1; // Base case for 1

      // Initialize the first two Fibonacci numbers
      let a = 0, b = 1;
      let fib;

      // Calculate Fibonacci sequence iteratively
      for (let i = 2; i <= n; i++) {
        fib = a + b; // Calculate the next Fibonacci number
        a = b;       // Update a to the previous Fibonacci number
        b = fib;     // Update b to the current Fibonacci number
      }

      return fib; // Return the nth Fibonacci number
    }
  `;

	it("should return correct Fibonacci numbers for valid inputs", async () => {
		// Test first few Fibonacci numbers
		const testCases = [
			{ input: 0, expected: 0 },
			{ input: 1, expected: 1 },
			{ input: 2, expected: 1 },
			{ input: 3, expected: 2 },
			{ input: 4, expected: 3 },
			{ input: 5, expected: 5 },
			{ input: 6, expected: 8 },
			{ input: 7, expected: 13 },
			{ input: 8, expected: 21 },
			{ input: 9, expected: 34 },
			{ input: 10, expected: 55 },
		];

		for (const { input, expected } of testCases) {
			const result = await executeFunction(fibonacciFunction, {
				args: [input],
			});
			expect(result).toBe(expected);
		}
	});

	it("should handle negative numbers", async () => {
		const result = await executeFunction(fibonacciFunction, {
			args: [-1],
		});
		expect(result).toBe("Input must be a non-negative integer");
	});

	it("should execute with custom timeout", async () => {
		const result = await executeFunction(fibonacciFunction, {
			args: [10],
			timeout: 1000,
		});
		expect(result).toBe(55);
	});

	it("should execute with excessive computation", async () => {
		const result = await executeFunction(fibonacciFunction, {
			args: [1000000], // Very large number
			timeout: 100, // Short timeout
		});
		expect(result).toBe(Number.POSITIVE_INFINITY);
	});
});
