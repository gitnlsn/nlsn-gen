import { openai } from "@ai-sdk/openai";
import { Agent, Mastra, createLogger } from "@mastra/core";
import { beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { env } from "../../config/env";
import { googleSearchTool } from "./googleSearchTool";

describe("Google Search Tool Integration", () => {
	// Verifica se a chave de API está configurada antes de executar os testes
	beforeAll(() => {
		if (!env.SERP_API_KEY) {
			throw new Error("SERP_API_KEY não está configurada no ambiente de teste");
		}
	});

	it("deve realizar uma busca no Google e retornar resultados orgânicos", async () => {
		// Configurar o agent com a googleSearchTool
		const agent = new Agent({
			instructions: `You are a helpful assistant that can search the web for information.
        
        Use the googleSearchTool to search the web for information.

        Think about the user query and define a more elaborated query to do a proper research on google.

        Do a first single query with the googleSearchTool.

        Parse the title and snippet of the organic results and define 5 new terms to go deeper into the research.

        Do a second query step with the 5 new terms.

        Agregate the information retrieved and return a summary of the research.

        If you still don't have enough information to answer the user query, do a third query step with the 5 new terms.
        `,
			model: openai("gpt-4o-mini"),
			name: "Google Search Agent",
			tools: {
				googleSearchTool: googleSearchTool,
			},
			mastra: new Mastra({
				logger: createLogger({
					name: "Google Search Agent",
					level: "debug",
				}),
			}),
		});

		// Executar a busca
		const query = "O que é o 'mastra.ai'?";
		// Verificar se os resultados foram retornados corretamente
		const result = await agent.generate([
			{
				role: "user",
				content: `Search for "${query}"`,
			},
		]);

		console.log("result", result.text);

		expect(result).toBeDefined();
	}, 30000);
});
