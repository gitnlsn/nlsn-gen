import { createTool } from "@mastra/core";
import { z } from "zod";
import { env } from "../../config/env";

interface OrganicResult {
	title: string;
	link: string;
	snippet: string;
}

// Interface para o resultado da SerpAPI
interface SerpApiOrganicResult {
	title?: string;
	link?: string;
	snippet?: string;
}

interface GoogleSearchToolOutput {
	organicResults: OrganicResult[];
}

export const googleSearchTool = createTool({
	id: "Google Search",
	description: "Realiza uma busca no Google e retorna os resultados orgânicos",

	inputSchema: z.object({
		q: z.string().describe("Termo de busca a ser pesquisado no Google"),
	}),

	outputSchema: z.object({
		organicResults: z.array(
			z.object({
				title: z.string(),
				link: z.string(),
				snippet: z.string(),
			}),
		),
	}),

	execute: async ({ context }): Promise<GoogleSearchToolOutput> => {
		const { q } = context;

		try {
			// Construir a URL para a API do SerpApi
			const url = new URL("https://serpapi.com/search");
			url.searchParams.append("q", q);
			url.searchParams.append("engine", "google");
			url.searchParams.append("api_key", env.SERP_API_KEY);

			// Fazer a requisição para a SerpApi
			const response = await fetch(url.toString());

			if (!response.ok) {
				throw new Error(
					`Erro na requisição: ${response.status} ${response.statusText}`,
				);
			}

			const data = await response.json();

			// Extrair apenas os resultados orgânicos com os campos solicitados
			const organicResults: OrganicResult[] =
				data.organic_results?.map((result: SerpApiOrganicResult) => ({
					title: result.title || "",
					link: result.link || "",
					snippet: result.snippet || "",
				})) || [];

			return {
				organicResults,
			};
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Erro ao realizar busca no Google: ${error.message}`);
			}
			throw new Error("Erro desconhecido ao realizar busca no Google");
		}
	},
});
