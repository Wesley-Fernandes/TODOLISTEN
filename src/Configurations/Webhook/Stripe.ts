import Stripe from "stripe";
import Variables from "../Variables";

const stripe = new Stripe(Variables.stripe.secretKey, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

export default stripe;
