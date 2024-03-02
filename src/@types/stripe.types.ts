import Stripe from "stripe";

export interface StripeWebhookCheckout {
  data: { object: Stripe.Checkout.Session };
}

export interface StripeWebhookSubscription {
  data: { object: Stripe.Subscription };
}
