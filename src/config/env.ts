import { z } from "zod";

const schema = z.object({
	OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
});

function validateEnv() {
	const parsed = schema.safeParse(process.env);

	if (!parsed.success) {
		console.error("❌ Invalid environment variables:");
		for (const error of parsed.error.errors) {
			console.error(`- ${error.path}: ${error.message}`);
		}
		throw new Error("Invalid environment variables");
	}

	return parsed.data;
}

export const env = validateEnv();
