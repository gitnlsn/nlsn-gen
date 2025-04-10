import { mkdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { executeFunction } from "./executeFunction";

describe("executeFunction", () => {
	it("deve executar uma função javascript e retornar o resultado esperado", async () => {
		// Act
		const resultado = await executeFunction("f", {
			context: {
				f: () => "hello world",
			},
		});

		// Assert
		expect(resultado).toBe("hello world");
	});
});

describe("execute mkdir", () => {
	it.skip("deve criar um diretório", async () => {
		// Act
		const resultado = await executeFunction(
			"function() { mkdirSync('./hello world'); return 'hello world' }",
			{
				context: {
					mkdirSync,
				},
			},
		);

		// Assert
		expect(resultado).toBe("hello world");
	});
});
