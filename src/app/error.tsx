'use client' // Error boundaries must be Client Components

import { Button } from '@/lib/components/ui/button'
import { useEffect } from 'react'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error)
	}, [error])

	return (
		<main className="flex justify-start items-start gap-8 flex-col min-h-dvh max-w-[98%] m-auto pt-6">
			<h2 className='text-6xl'>Uh oh! Something went wrong...</h2>
			<div className="flex flex-col gap-1">
				<p className="font-bold text-red-500 text-2xl">{error.name}</p>
				<p className="">{error.message}</p>
				{error.stack && <code className="bg-card p-4 rounded-lg max-h-64 overflow-auto mt-1">{error.stack}</code>}
			</div>
			<Button
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}
			>
				Try again
			</Button>
		</main>
	)
}
