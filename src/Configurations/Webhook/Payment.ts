import Utils from "../../Utils";
import Variables from "../Variables";
import stripe from "./Stripe";

export async function Payment(userID: string, userEmail: string) {
  try {
    let customer = await Utils.Stripe.get_customer_by_id(userEmail);

    if (!customer) {
      customer = await stripe.customers.create({
        email: userEmail,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: Variables.stripe.proPrice,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: customer.id,
      client_reference_id: userID,
      success_url: "http://localhost:4041/sucess.html",
      cancel_url: "http://localhost:4041/cancel.html",
    });

    return {
      customerID: customer.id,
      status: 201,
      url: session.url,
    };
  } catch (error) {
    console.error(error);
    return { status: 400, error };
  }
}
