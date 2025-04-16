CREATE TABLE "user_crypto_platform_fee" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_crypto_platform_fee_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" varchar(255) NOT NULL,
	"platform" "crypto_trade_platform" NOT NULL,
	"crypto_buy_fee_percentage" double precision DEFAULT 0,
	"crypto_sell_fee_percentage" double precision DEFAULT 0,
	"fiat_buy_fee_percentage" double precision DEFAULT 0,
	"fiat_sell_fee_percentage" double precision DEFAULT 0
);
