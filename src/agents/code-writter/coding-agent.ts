import { openai } from "@ai-sdk/openai";
import { Agent, Mastra, createLogger } from "@mastra/core";
import { z } from "zod";
import { inputOutputTestingTool } from "../../tools/input-output-testing-tool/InputOutputTestingTool";

// Define schema for code generation output
export const codeOutputSchema = z.object({
	code: z.string(),
	explanation: z.string(),
	language: z.enum(["javascript"]),
});

export type CodeImplementation = z.infer<typeof codeOutputSchema>;

// Create the coding agent
export const codingAgent = new Agent({
	name: "Coding Assistant",
	instructions: `You are an expert programming assistant that helps generate and explain code.
    - Write clean, well-documented, and efficient code
    - include comments to explain the code when necessary
    - Follow best practices and conventions for each programming language
    - Consider edge cases and error handling
    - Use modern syntax and features when appropriate
    - Always use the input output testing tool to validate the function when the user provides a list of input/output pairs`,
	model: openai("gpt-4o-mini"),
	tools: {
		inputOutputTestingTool: inputOutputTestingTool,
	},
	mastra: new Mastra({
		logger: createLogger({
			name: "Coding Agent",
			level: "debug",
		}),
	}),
});

// Example usage:
/*
const response = await codingAgent.generate(
  [{
    role: "user",
    content: "Write a function to calculate fibonacci sequence in JavaScript"
  }],
  {
    output: codeOutputSchema,
  }
);

console.log(response.object);
*/
