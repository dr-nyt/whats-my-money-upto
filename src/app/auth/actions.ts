'use server'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const LoginFormSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
	password: z.string().trim(),
});

const SignupFormSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters long.' })
		.trim(),
	email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
	password: z
		.string()
		.min(8, { message: 'Be at least 8 characters long' })
		.regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
		.regex(/[0-9]/, { message: 'Contain at least one number.' })
		.regex(/[^a-zA-Z0-9]/, {
			message: 'Contain at least one special character.',
		})
		.trim(),
});

type AuthFormState = {
	errors?: {
		name?: string[]
		email?: string[]
		password?: string[]
		other?: string[]
	}
	message?: string
} | undefined;

export async function login(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
	const validatedFields = LoginFormSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.signInWithPassword(validatedFields.data);

	if (error) {
		return {
			errors: { other: [error.message] }
		};
	}

	revalidatePath('/', 'layout');
	redirect('/');
}

export async function signup(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
	const validatedFields = SignupFormSchema.safeParse({
		name: formData.get('name'),
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.signUp(validatedFields.data);

	if (error) {
		return {
			errors: { other: [error.message] }
		};
	}

	revalidatePath('/', 'layout');
	redirect('/');
}

export async function logout() {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		throw new Error(error.message);
	}

	revalidatePath('/', 'layout');
	redirect('/');
}
