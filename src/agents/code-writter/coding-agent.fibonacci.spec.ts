import { describe, expect, it } from "vitest";
import { executeFunction } from "../../utils/eval/executeFunction";
import { codeOutputSchema, codingAgent } from "./coding-agent";

describe("Coding Agent", () => {
	it("should generate code", async () => {
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
			const result = await executeFunction(response.object.code, {
				args: [input],
			});
			expect(result).toBe(expected);
		}
	}, 30000);
});
