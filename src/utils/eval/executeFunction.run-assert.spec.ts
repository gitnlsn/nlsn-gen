import assert from "node:assert";
import { describe, expect, it } from "vitest";
import { executeAssert } from "./executeAssert";
import { executeFunction } from "./executeFunction";

describe("executeFunction running assertions", () => {
	it("should successfully run assert inside VM", async () => {
		const result = await executeFunction(
			`
      function() {
        // This should not throw
        assert(true, "assert with true should pass");
        
        // This should throw
        try {
          assert(false, "This should fail");
          throw new Error("Expected assert(false) to throw");
        } catch (error) {
          // Assert failure was caught as expected
          return true;
        }
      }
    `,
			{
				context: {
					assert,
				},
			},
		);

		expect(result).toBe(true);
	});

	it("should throw when assertion fails", async () => {
		const promise = executeFunction(
			`
      function() {
        assert.equal(1,2);
        return true;
      }
    `,
			{
				context: {
					assert: assert,
				},
			},
		);

		await expect(promise).rejects.toThrow(
			"Error executing function in VM: 1 == 2",
		);
	});

	describe("executeAssert", () => {
		it("should handle primitive equality assertions", async () => {
			await executeAssert("function(x) { return x + 1; }", {
				input: 1,
				expected: 2,
			});
		});

		it("should handle array deep equality", async () => {
			await executeAssert("function(arr) { return [...arr, 4]; }", {
				input: [1, 2, 3],
				expected: [1, 2, 3, 4],
			});
		});

		it("should handle object deep equality", async () => {
			await executeAssert("function(obj) { return { ...obj, d: 4 }; }", {
				input: { a: 1, b: 2, c: 3 },
				expected: { a: 1, b: 2, c: 3, d: 4 },
			});
		});

		it("should handle async functions", async () => {
			await executeAssert(
				`async function(x) { 
          await new Promise(resolve => setTimeout(resolve, 10));
          return x * 2;
        }`,
				{ input: 2, expected: 4 },
			);
		});

		it("should throw when assertion fails", async () => {
			const promise = executeAssert("function(x) { return x + 1; }", {
				input: 1,
				expected: 3,
			});

			await expect(promise).rejects.toThrow(
				"Expected values to be strictly equal",
			);
		});
	});
});
