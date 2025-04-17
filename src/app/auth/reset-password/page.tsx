'use client';
import { useActionState } from 'react';
import { CircleNotch } from '@mynaui/icons-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { resetPassword } from '../actions';

export default function SignupForm() {
	const [state, loginAction, pending] = useActionState(resetPassword, undefined);
	console.log(state);

	return (
		<main className="flex flex-col items-center justify-center min-h-screen">
			<form action={loginAction}>
				<Card className="w-[350px]">
					<CardHeader>
						<CardTitle className="text-2xl">Reset Password</CardTitle>
						<CardDescription className="text-red-400">{state?.errors?.other}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-1">
							<label htmlFor="email" className="text-sm">email</label>
							<Input id="email" name="email" type="email" className="px-2 py-1" required />
						</div>
						<p className="text-xs text-red-400 mb-4">{state?.errors?.email}</p>
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button variant="secondary" asChild>
							<Link href="/auth/login">
								Login
							</Link>
						</Button>
						<Button type="submit" disabled={pending} className="cursor-pointer disabled:cursor-default">{pending ?
							<CircleNotch className="animate-spin" />
							: "Reset Password"
						}</Button>
					</CardFooter>
				</Card>
			</form>
		</main>
	);
}
