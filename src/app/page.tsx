import CryptoTradeForm from "@/lib/components/crypto_trade_form";
import { logout } from "./auth/actions";

export default function Home() {
	return (
		<main>
			<h1 className="text-9xl">ETH/USDT</h1>
			<h2>1560.0123456789</h2>
			<code>
				if (hello)
				then_bye(0123456789);
			</code>
			<CryptoTradeForm />
			<form action={logout}>
				<button type="submit">Logout</button>
			</form>
		</main >
	);
}
