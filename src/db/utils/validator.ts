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
	if ((data as any).uid !== undefined) (data as any).uid = user.id;
	const validatedData = (schema as any).safeParse(data) as SafeParseReturnType<T, T>;
	if (!validatedData.success) {
		console.error("Invalid data", validatedData.error.format());
		return validatedData;
	}
	return validatedData;
}
