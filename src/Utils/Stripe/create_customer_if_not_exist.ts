import stripe from "../../Configurations/Webhook/Stripe";
import { get_customer_by_id } from "./get-customer-by-id";

interface props {
  email: string;
  name: string;
}
export const create_customer_if_not_exist = async ({ email, name }: props) => {
  let customer = await get_customer_by_id(email);
  if (customer) {
    return customer;
  } else {
    const newCustomer = await stripe.customers.create({ email, name });
    return newCustomer;
  }
};
