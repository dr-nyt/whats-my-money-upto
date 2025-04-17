'use server'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sCreateClient, sGetUser } from '@/lib/supabase/server';
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
	rePassword: z.string().trim(),
}).refine((data) => data.password === data.rePassword, {
	message: 'Passwords do not match.',
	path: ['rePassword'],
});

const ResetPasswordFormSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email.' }).trim()
});

const UpdatePasswordFormSchema = z.object({
	password: z
		.string()
		.min(8, { message: 'Be at least 8 characters long' })
		.regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
		.regex(/[0-9]/, { message: 'Contain at least one number.' })
		.regex(/[^a-zA-Z0-9]/, {
			message: 'Contain at least one special character.',
		})
		.trim(),
	rePassword: z.string().trim(),
}).refine((data) => data.password === data.rePassword, {
	message: 'Passwords do not match.',
	path: ['rePassword'],
});

type AuthFormState = {
	errors?: {
		name?: string[];
		email?: string[];
		password?: string[];
		rePassword?: string[];
		other?: string[];
	}
	message?: string;
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

	const supabase = await sCreateClient();
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
		rePassword: formData.get('rePassword'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const supabase = await sCreateClient();
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
	const supabase = await sCreateClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		throw new Error(error.message);
	}

	revalidatePath('/', 'layout');
	redirect('/');
}

export async function resetPassword(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
	const supabase = await sCreateClient();

	const validatedFields = ResetPasswordFormSchema.safeParse({
		email: formData.get('email'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { error } = await supabase.auth.resetPasswordForEmail(validatedFields.data.email, {
		redirectTo: `${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL : 'http://localhost:3000'}/auth/update-password`,
	});

	if (error) {
		return {
			errors: { other: [error.message] }
		};
	}

	revalidatePath('/', 'layout');
	redirect('/auth/login?reset=true');
}

export async function updatePassword(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
	const supabase = await sCreateClient();
	const auth = await supabase.auth.getUser();
	if (!auth.data.user) {
		return {
			errors: { other: ['User not found'] }
		};
	}

	const validatedFields = UpdatePasswordFormSchema.safeParse({
		password: formData.get('password'),
		rePassword: formData.get('rePassword'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { error } = await supabase.auth.updateUser({
		password: validatedFields.data.password,
	});

	if (error) {
		return {
			errors: { other: [error.message] }
		};
	}

	revalidatePath('/', 'layout');
	redirect('/');
}
