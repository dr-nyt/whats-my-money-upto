'use client';
import { startTransition, useActionState } from 'react';
import { signup } from '../actions';
import { CircleNotch } from '@mynaui/icons-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Input } from '@/lib/components/ui/input';
import { Button } from '@/lib/components/ui/button';
import { PasswordInputUI } from '@/lib/components/custom_ui/input';

export default function SignupForm() {
	const [state, signUpAction, pending] = useActionState(signup, undefined);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		startTransition(() => {
			signUpAction(formData);
		});
	}

	return (
		<main className="flex flex-col items-center justify-center min-h-screen">
			<form onSubmit={handleSubmit}>
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Sign Up</CardTitle>
						<CardDescription className="text-red-400">{state?.errors?.other}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-1">
							<label htmlFor="name" className="text-sm">name</label>
							<Input id="name" name="name" className="px-2 py-1" required />
						</div>
						<p className="text-xs text-red-400 mb-4 mt-1">{state?.errors?.name}</p>

						<div className="flex flex-col gap-1">
							<label htmlFor="email" className="text-sm">email</label>
							<Input id="email" name="email" type="email" className="px-2 py-1" required />
						</div>
						<p className="text-xs text-red-400 mb-4 mt-1">{state?.errors?.email}</p>

						<PasswordInputUI />
						<div className="text-xs text-red-400 mb-4 mt-1">
							{state?.errors?.password && (
								<>
									<p>Password must:</p>
									<ul>
										{state.errors.password.map((error) => (
											<li key={error}>- {error}</li>
										))}
									</ul>
								</>
							)}
						</div>

						<PasswordInputUI id="rePassword" label="retype password" />
						<p className="text-xs text-red-400 mb-4 mt-1">{state?.errors?.rePassword}</p>

					</CardContent>
					<CardFooter className="flex justify-between gap-4">
						<Button variant="secondary" asChild>
							<Link href="/auth/login">
								Already have an account?
							</Link>
						</Button>
						<Button type="submit" disabled={pending}>{pending ?
							<CircleNotch className="animate-spin" />
							: "Sign Up"
						}</Button>
					</CardFooter>
				</Card>
			</form>
		</main>
	);
}
