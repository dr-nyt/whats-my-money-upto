import { User } from "@supabase/supabase-js";
import { SafeParseReturnType, z } from "zod";

const idSchema = z.number().int().nonnegative().finite().safe();

export const validateId = (id: number) => {
	const validatedId = idSchema.safeParse(id);
	if (!validatedId.success) {
		console.error("Invalid trade ID", validatedId.error.format());
		return null;
	}
	return validatedId.data;
}

export const validateData = <T, S>(user: User, data: T, schema: S) => {
	const validatedData = (schema as any).safeParse(data) as SafeParseReturnType<T, any>;
	if (!validatedData.success) {
		console.error("Invalid data", validatedData.error.format());
		return null;
	}
	if (validatedData.data.uid) validatedData.data.uid = user.id;
	return validatedData.data;
}
