import stripe from "../../Configurations/Webhook/Stripe";

export const get_customer_by_id = async (email: string) => {
  const customer = await stripe.customers.list({ email });
  return customer.data[0];
};
