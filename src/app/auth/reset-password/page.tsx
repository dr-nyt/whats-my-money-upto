'use client';
import { startTransition, useActionState, useEffect, useState } from 'react';
import { Check, ChevronLeft, CircleNotch } from '@mynaui/icons-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { resetPassword } from '../actions';

export default function SignupForm() {
	const [state, resetPassAction, pending] = useActionState(resetPassword, undefined);
	const [message, setMessage] = useState("");

	useEffect(() => {
		let timeout = null as NodeJS.Timeout | null;
		if (state?.message) {
			setMessage(state.message);
			timeout = setTimeout(() => setMessage(""), 5000);
		}

		return () => { timeout && clearTimeout(timeout); }
	}, [state]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		startTransition(() => {
			const res = resetPassAction(formData);
		});
	}

	return (
		<main className="flex flex-col items-center justify-center min-h-screen">
			<form onSubmit={handleSubmit}>
				<Card className="w-[350px]">
					<CardHeader>
						<CardTitle className="text-2xl">Reset Password</CardTitle>
						<CardDescription className="text-red-400">{state?.errors?.other}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-1">
							<label htmlFor="email" className="text-sm">email</label>
							<Input id="email" name="email" type="email" className="px-2 py-1" required disabled={!!message} />
						</div>
						{message && <p className="text-xs text-green-400 mb-4">{message}</p>}
						<p className="text-xs text-red-400 mb-4">{state?.errors?.email}</p>
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button variant="secondary" asChild>
							<Link href="/auth/login"><ChevronLeft /> Login</Link>
						</Button>
						<Button type="submit" disabled={pending || !!message}>
							{pending ? <CircleNotch className="animate-spin" /> : !!message ? <Check /> : "Reset Password"}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</main>
	);
}
