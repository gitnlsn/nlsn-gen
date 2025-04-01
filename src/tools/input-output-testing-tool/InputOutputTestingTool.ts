import { createTool } from "@mastra/core";
import { z } from "zod";
import { executeAssert } from "../../utils/eval/executeAssert";

export const inputOutputTestingTool = createTool({
	id: "Input Output Testing",
	description:
		"Testa uma implementação de função verificando se ela produz as saídas esperadas para determinadas entradas",

	inputSchema: z.object({
		implementation: z
			.string()
			.describe("Código da função a ser testada em formato string"),
		testCases: z
			.array(
				z.object({
					input: z.any().describe("Valor de entrada para o teste"),
					expected: z.any().describe("Valor esperado como saída do teste"),
				}),
			)
			.describe("Array de casos de teste com input e output esperado"),
		timeout: z
			.number()
			.optional()
			.describe(
				"Tempo limite em ms para execução de cada teste. Padrão: 5000ms",
			),
	}),

	execute: async ({ context }) => {
		const { implementation, testCases, timeout = 5000 } = context;
		const errors: string[] = [];

		try {
			for (const [index, testCase] of testCases.entries()) {
				try {
					await executeAssert(implementation, {
						input: testCase.input,
						expected: testCase.expected,
						timeout,
					});
				} catch (error) {
					if (error instanceof Error) {
						errors.push(
							`Falha no caso de teste ${index + 1}:
               Input: ${JSON.stringify(testCase.input)}
               Expected: ${JSON.stringify(testCase.expected)}
               Error: ${error.message}`,
						);
					}
				}
			}

			return {
				success: errors.length === 0,
				errors,
			};
		} catch (error) {
			if (error instanceof Error) {
				return {
					success: false,
					errors: [`Erro ao executar os testes: ${error.message}`],
				};
			}
			return {
				success: false,
				errors: ["Erro desconhecido ao executar os testes"],
			};
		}
	},
});
