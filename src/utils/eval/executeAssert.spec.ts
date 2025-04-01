import { describe, expect, it } from "vitest";
import { executeAssert } from "./executeAssert";

describe("executeAssert", () => {
	it("should execute function and compare with expected result", async () => {
		const fn = "x => x + 1";
		const result = await executeAssert(fn, {
			input: 1,
			expected: 2,
		});
		expect(result).toBe(2);
	});

	it("should handle async functions", async () => {
		const fn = "x => Promise.resolve(x * 2)";
		const result = await executeAssert(fn, {
			input: 3,
			expected: 6,
		});
		expect(result).toBe(6);
	});

	it("should handle array comparison", async () => {
		const fn = "arr => arr.map(x => x * 2)";
		const result = await executeAssert(fn, {
			input: [1, 2, 3],
			expected: [2, 4, 6],
		});
		expect(result).toEqual([2, 4, 6]);
	});

	it("should handle object comparison", async () => {
		const fn = "obj => ({ ...obj, value: obj.value * 2 })";
		const result = await executeAssert(fn, {
			input: { value: 5 },
			expected: { value: 10 },
		});
		expect(result).toEqual({ value: 10 });
	});

	it("should throw when assertion fails", async () => {
		const fn = "x => x + 1";
		await expect(
			executeAssert(fn, {
				input: 1,
				expected: 3,
			}),
		).rejects.toThrow();
	});

	it("should execute function without assertions when no input/expected provided", async () => {
		const fn = "() => 42";
		const result = await executeAssert(fn);
		expect(result).toBe(42);
	});
});
