import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core";
import { z } from "zod";

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
    - Provide clear explanations of how the code works
    - include comments to explain the code when necessary
    - Follow best practices and conventions for each programming language
    - Consider edge cases and error handling
    - Use modern syntax and features when appropriate`,
	model: openai("gpt-4o-mini"),
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
