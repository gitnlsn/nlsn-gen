import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core";
import { z } from "zod";
import { inputOutputTestingTool } from "../../tools/input-output-testing-tool/InputOutputTestingTool";
import {
	CodeImplementation,
	codeOutputSchema,
} from "../code-writter/coding-agent";

// Define schema for test cases
const testCaseSchema = z.object({
	input: z.any(),
	expected: z.any(),
});

export type TestCase = z.infer<typeof testCaseSchema>;

// Define schema for test results
const testResultSchema = z.object({
	success: z.boolean(),
	errors: z.array(z.string()),
});

export type TestResult = z.infer<typeof testResultSchema>;

// Create the testing agent
export const codeTesterAgent = new Agent({
	name: "Code Testing Assistant",
	instructions: `You are an expert code testing assistant that helps test and improve code implementations.
    - Run test cases against provided code implementations
    - Analyze test failures and suggest improvements
    - Ensure code meets requirements and passes all test cases
    - Consider edge cases and error handling
    - Provide clear explanations of test failures`,
	model: openai("gpt-4"),
	tools: {
		inputOutputTestingTool: inputOutputTestingTool,
	},
});

// Example usage:
/*
const response = await codeTesterAgent.generate([
  {
    role: "user", 
    content: `Test this implementation:
      function fibonacci(n) {
        if (n <= 1) return n;
        return fibonacci(n-1) + fibonacci(n-2);
      }
      
      Test cases:
      [
        { input: 0, expected: 0 },
        { input: 1, expected: 1 },
        { input: 5, expected: 5 }
      ]`
  }
], {
  maxSteps: 3, // Allow multiple steps for testing and improvement
  output: testResultSchema
});

console.log(response.object);
*/
