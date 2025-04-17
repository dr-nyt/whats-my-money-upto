'use client';
import { useActionState } from 'react';
import { signup } from '../actions';
import { CircleNotch } from '@mynaui/icons-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Input } from '@/lib/components/ui/input';
import { Button } from '@/lib/components/ui/button';

export default function SignupForm() {
	const [state, signUpAction, pending] = useActionState(signup, undefined);

	return (
		<main className="flex flex-col items-center justify-center min-h-screen">
			<form action={signUpAction}>
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
						<p className="text-xs text-red-400 mb-4">{state?.errors?.name}</p>

						<div className="flex flex-col gap-1">
							<label htmlFor="email" className="text-sm">email</label>
							<Input id="email" name="email" type="email" className="px-2 py-1" required />
						</div>
						<p className="text-xs text-red-400 mb-4">{state?.errors?.email}</p>

						<div className="flex flex-col gap-1">
							<label htmlFor="password" className="text-sm">password</label>
							<Input id="password" name="password" type="password" className="px-2 py-1" required />
						</div>
						<div className="text-xs text-red-400 mb-4">
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

						<div className="flex flex-col gap-1">
							<label htmlFor="rePassword" className="text-sm">retype password</label>
							<Input id="rePassword" name="rePassword" type="password" className="px-2 py-1" required />
						</div>
						<p className="text-xs text-red-400 mb-4">{state?.errors?.rePassword}</p>

					</CardContent>
					<CardFooter className="flex justify-between gap-4">
						<Button variant="secondary" asChild>
							<Link href="/auth/login">
								Already have an account?
							</Link>
						</Button>
						<Button type="submit" disabled={pending} className="cursor-pointer disabled:cursor-default">{pending ?
							<CircleNotch className="animate-spin" />
							: "Sign Up"
						}</Button>
					</CardFooter>
				</Card>
			</form>
		</main>
	);
}
