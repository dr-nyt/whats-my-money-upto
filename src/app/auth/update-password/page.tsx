'use client';
import { startTransition, useActionState, useEffect, useState } from 'react';
import { Check, ChevronLeft, CircleNotch, DangerDiamond } from '@mynaui/icons-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { updatePassword } from '../actions';
import { cGetUser } from '@/lib/supabase/client';
import Link from 'next/link';
import { PasswordInputUI } from '@/lib/components/custom_ui/input';

export default function SignupForm() {
	const [state, updatePassAction, pending] = useActionState(updatePassword, undefined);
	const [loadingUser, setLoadingUser] = useState(true);
	const [email, setEmail] = useState("");

	useEffect(() => {
		cGetUser().then((user) => {
			if (user) {
				setEmail(user.email || "");
			}
			setLoadingUser(false);
		}).catch((error) => {
			console.error("Error fetching user:", error);
		});
	}, []);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		startTransition(() => {
			updatePassAction(formData);
		});
	}

	return (
		<main className="flex flex-col items-center justify-center min-h-screen">
			<form onSubmit={handleSubmit}>
				<Card className="w-[350px]">
					<CardHeader>
						<CardTitle className="text-2xl">Update Password</CardTitle>
						<CardDescription className="text-red-400">{state?.errors?.other}</CardDescription>
						{(!loadingUser && !email) && <CardDescription className="text-red-400">Something went wrong! Try again later.</CardDescription>}
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-1">
							<label htmlFor="email" className="text-sm">email</label>
							<div className="flex items-center gap-1">
								<Input id="email" name="email" type="email" className="px-2 py-1" disabled value={email} required />
								{loadingUser && <CircleNotch className="animate-spin" />}
								<Button variant="ghost" size="icon" type="button" disabled className="disabled:opacity-100">
									{(!loadingUser && !email) && <DangerDiamond className="text-red-400 !w-5 !h-5" />}
									{(!loadingUser && email) && <Check className="text-green-400 !w-5 !h-5" />}
									{loadingUser && <CircleNotch className="animate-spin !w-5 !h-5" />}
								</Button>
							</div>
						</div>
						<p className="text-xs text-red-400 mb-4">{state?.errors?.email}</p>

						<PasswordInputUI />
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

						<PasswordInputUI id="rePassword" label="retype password" />
						<p className="text-xs text-red-400 mb-4">{state?.errors?.rePassword}</p>
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button variant="secondary" asChild>
							<Link href="/auth/login"><ChevronLeft /> Login</Link>
						</Button>
						<Button type="submit" disabled={pending} className="cursor-pointer disabled:cursor-default">{pending ?
							<CircleNotch className="animate-spin" />
							: "Update Password"
						}</Button>
					</CardFooter>
				</Card>
			</form>
		</main>
	);
}
