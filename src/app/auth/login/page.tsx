'use client';
import { startTransition, useActionState, useState } from 'react';
import { login } from '../actions';
import { ArrowRight, CircleNotch, Eye, EyeSlash } from '@mynaui/icons-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';

export default function SignupForm() {
	const [state, loginAction, pending] = useActionState(login, undefined);
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		startTransition(() => {
			loginAction(formData);
		});
	}

	return (
		<main className="flex flex-col items-center justify-center min-h-screen">
			<form onSubmit={handleSubmit}>
				<Card className="w-[350px]">
					<CardHeader>
						<CardTitle className="text-2xl">Login</CardTitle>
						<CardDescription className="text-red-400">{state?.errors?.other}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-1">
							<label htmlFor="email" className="text-sm">email</label>
							<Input id="email" name="email" type="email" className="px-2 py-1" required />
						</div>
						<p className="text-xs text-red-400 mb-4">{state?.errors?.email}</p>

						<div className="flex flex-col gap-1">
							<label htmlFor="password" className="text-sm">password</label>
							<div className="flex gap-1">
								<Input id="password" name="password" type={showPassword ? "text" : "password"} className="px-2 py-1" required />
								<Button variant="ghost" size="icon" type="button" className="cursor-pointer" onClick={() => setShowPassword(v => !v)}>
									{showPassword ? <Eye /> : <EyeSlash />}
								</Button>
							</div>
						</div>
						<Link href="/auth/reset-password" className="text-sm hover:underline">Forgot password?</Link>
						<p className="text-xs text-red-400 mb-4">{state?.errors?.password}</p>

					</CardContent>
					<CardFooter className="flex justify-between">
						<Button variant="secondary" asChild>
							<Link href="/auth/signup">
								Don't have an account?
							</Link>
						</Button>
						<Button type="submit" disabled={pending} className="cursor-pointer disabled:cursor-default">{pending ?
							<CircleNotch className="animate-spin" />
							: <div className='flex items-center gap-1'>
								Login
								<ArrowRight />
							</div>
						}</Button>
					</CardFooter>
				</Card>
			</form>
		</main>
	);
}
