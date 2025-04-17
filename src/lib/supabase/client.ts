import { createBrowserClient } from '@supabase/ssr';

export function cCreateClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
}

export async function cGetUser() {
	const supabase = await cCreateClient();
	const { data, error } = await supabase.auth.getUser();
	if (error) return null;
	return data.user;
}
