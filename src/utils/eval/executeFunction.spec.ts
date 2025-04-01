import { describe, expect, it } from "vitest";
import { executeFunction } from "./executeFunction";

describe("executeFunction", () => {
	it("deve executar função com argumentos string e number corretamente", async () => {
		const fnString = `
      function(texto, numero) {
        return texto + ' ' + numero;
      }
    `;

		const resultado = await executeFunction(fnString, {
			args: ["Teste", 42],
		});

		expect(resultado).toBe("Teste 42");
	});

	it("deve executar função com múltiplos tipos de argumentos e contexto", async () => {
		const fnString = `
      function(texto, numero) {
        return texto + ' ' + numero + ' ' + this.prefixo;
      }
    `;

		const resultado = await executeFunction(fnString, {
			context: { prefixo: "Resultado:" },
			args: ["Teste", 42],
		});

		expect(resultado).toBe("Teste 42 Resultado:");
	});
});
