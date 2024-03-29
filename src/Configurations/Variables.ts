import "dotenv/config";
const WEBHOOK_SECRETKEY = process.env.WEBHOOK_SECRETKEY as string;
const STRIPE_SECRETKEY = process.env.STRIPE_TEST_SECRET_KEY as string;
const STRIPE_PUBKEY = process.env.STRIPE_TEST_PUB_KEY as string;
const STRIPE_PRO_PRICE = process.env.STRIPE_PRO_PRICE as string;

if (!WEBHOOK_SECRETKEY) {
  throw new Error("WEBHOOK_SECRETKEY is not defined");
} else if (!STRIPE_SECRETKEY) {
  throw new Error("STRIPE_SECRETKEY is not defined");
} else if (!STRIPE_PUBKEY) {
  throw new Error("STRIPE_PUBKEY is not defined");
} else if (!STRIPE_PRO_PRICE) {
  throw new Error("STRIPE_PRO_PRICE is not defined");
} else if (!STRIPE_PRO_PRICE) {
  throw new Error("STRIPE_PRO_PRICE is not defined");
}
const Variables = {
  stripe: {
    pubKey: STRIPE_PUBKEY,
    secretKey: STRIPE_SECRETKEY,
    proPrice: STRIPE_PRO_PRICE,
    webHookSecret: WEBHOOK_SECRETKEY,
  },
};

export default Variables;
