'use client';
import { useActionState } from 'react';
import { signup } from '../actions';
import { CircleNotch } from '@mynaui/icons-react';
import Link from 'next/link';

export default function SignupForm() {
	const [state, signUpAction, pending] = useActionState(signup, undefined)

	return (
		<form action={signUpAction}>
			<div>
				<label htmlFor="name">Name</label>
				<input id="name" name="name" placeholder="Name" />
			</div>
			{state?.errors?.name && <p>{state.errors.name}</p>}

			<div>
				<label htmlFor="email">Email</label>
				<input id="email" name="email" placeholder="Email" />
			</div>
			{state?.errors?.email && <p>{state.errors.email}</p>}

			<div>
				<label htmlFor="password">Password</label>
				<input id="password" name="password" type="password" />
			</div>
			{state?.errors?.password && (
				<div>
					<p>Password must:</p>
					<ul>
						{state.errors.password.map((error) => (
							<li key={error}>- {error}</li>
						))}
					</ul>
				</div>
			)}
			<button disabled={pending} type="submit">
				{pending ?
					<CircleNotch className="animate-spin" />
					: "Sign Up"
				}
			</button>
			{state?.errors?.other && <p>{state.errors.other}</p>}

			<Link href="/auth/login" className="text-blue-500 hover:underline mt-4">
				Already have an account? Login
			</Link>
		</form>
	)
}
