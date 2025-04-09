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
						"Write a function to retrieve a list of pokemons from the pokemon api. the input is the name of the pokemon and the output should every data acquired from the api.",
				},
			],
			{
				output: codeOutputSchema,
				maxSteps: 3,
			},
		);

		expect(response.object.code).toBeDefined();
		expect(response.object.explanation).toBeDefined();

		const result = await executeFunction(response.object.code, {
			args: ["pikachu"],
		});

		expect(result.name).toBe("pikachu");
	}, 30000);
});
