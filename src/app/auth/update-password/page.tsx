'use client';
import { useActionState, useEffect, useState } from 'react';
import { CircleNotch } from '@mynaui/icons-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { updatePassword } from '../actions';
import { cGetUser } from '@/lib/supabase/client';

export default function SignupForm() {
	const [state, loginAction, pending] = useActionState(updatePassword, undefined);
	const [email, setEmail] = useState("");

	useEffect(() => {
		cGetUser().then((user) => {
			if (user) {
				setEmail(user.email || "");
			}
		}).catch((error) => {
			console.error("Error fetching user:", error);
		});
	}, []);

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
							<Input id="email" name="email" type="email" className="px-2 py-1" disabled value={email} />
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
					<CardFooter className="flex justify-end">
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
