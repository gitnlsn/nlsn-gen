import { describe, expect, it } from "vitest";
import { inputOutputTestingTool } from "../../tools/input-output-testing-tool/InputOutputTestingTool";
import { codeOutputSchema, codingAgent } from "./coding-agent";

describe("Coding Agent with Input/Output Testing", () => {
	it("should generate fibonacci function and validate with test cases", async () => {
		// Generate the code using the coding agent
		const response = await codingAgent.generate(
			[
				{
					role: "user",
					content:
						"Write a function to calculate fibonacci sequence. the input is the number of the sequence and the output should be a single number.",
				},
			],
			{
				output: codeOutputSchema,
				maxSteps: 3,
			},
		);

		expect(response.object.code).toBeDefined();
		expect(response.object.explanation).toBeDefined();

		// Define test cases for fibonacci sequence
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

		// Test the implementation using the InputOutputTestingTool
		const testResult = await inputOutputTestingTool.execute({
			context: {
				implementation: response.object.code,
				testCases,
				timeout: 5000,
			},
		});

		// Verify the test results
		expect(testResult.success).toBe(true);
		expect(testResult.errors).toHaveLength(0);

		// Test with an invalid implementation to ensure the tool catches errors
		const invalidResult = await inputOutputTestingTool.execute({
			context: {
				implementation: "function fibonacci(n) { return n; }", // Wrong implementation
				testCases: testCases.slice(0, 3), // Test only first 3 cases
				timeout: 5000,
			},
		});

		// Verify that the tool catches the invalid implementation
		expect(invalidResult.success).toBe(false);
		expect(invalidResult.errors.length).toBeGreaterThan(0);
	}, 30000);

	it("should handle edge cases and invalid inputs", async () => {
		const response = await codingAgent.generate(
			[
				{
					role: "user",
					content:
						"Write a function to calculate fibonacci sequence that handles negative numbers by returning null and non-number inputs by throwing an error.",
				},
			],
			{
				output: codeOutputSchema,
				maxSteps: 3,
			},
		);

		const edgeCases = [
			{ input: -1, expected: null },
			{ input: -5, expected: null },
			{ input: 0, expected: 0 },
			{ input: 1, expected: 1 },
		];

		const testResult = await inputOutputTestingTool.execute({
			context: {
				implementation: response.object.code,
				testCases: edgeCases,
				timeout: 5000,
			},
		});

		expect(testResult.success).toBe(true);
		expect(testResult.errors).toHaveLength(0);
	}, 30000);
});
