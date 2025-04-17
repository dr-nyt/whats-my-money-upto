import { z } from "zod";

const idSchema = z.number().int().nonnegative().finite().safe();

export const validateId = (id: number) => {
	const validatedId = idSchema.safeParse(id);
	if (!validatedId.success) {
		console.error("Invalid trade ID", validatedId.error.format());
		return null;
	}
	return validatedId.data;
}
