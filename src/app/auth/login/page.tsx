'use client';
import { useActionState } from 'react';
import { login } from '../actions';
import { CircleNotch } from '@mynaui/icons-react';
import Link from 'next/link';

export default function SignupForm() {
	const [state, loginAction, pending] = useActionState(login, undefined)

	return (
		<form action={loginAction}>
			<div>
				<label htmlFor="email">Email</label>
				<input id="email" name="email" placeholder="Email" />
			</div>
			{state?.errors?.email && <p>{state.errors.email}</p>}

			<div>
				<label htmlFor="password">Password</label>
				<input id="password" name="password" type="password" />
			</div>
			{state?.errors?.password && <p>{state.errors.password}</p>}

			<button disabled={pending} type="submit">
				{pending ?
					<CircleNotch className="animate-spin" />
					: "Login"
				}
			</button>
			{state?.errors?.other && <p>{state.errors.other}</p>}

			<Link href="/auth/signup" className="text-blue-500 hover:underline mt-4">
				Don't have an account? Sign up
			</Link>
		</form>
	)
}
