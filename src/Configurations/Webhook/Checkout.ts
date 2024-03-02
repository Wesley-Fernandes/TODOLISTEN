import { StripeWebhookCheckout } from "../../@types/stripe.types";
import prisma from "../Prisma";

export async function Checkout(event: StripeWebhookCheckout) {
  const client = event.data.object.client_reference_id as string;
  const sub = event.data.object.subscription as string;
  const customer = event.data.object.customer as string;
  const status = event.data.object.status;

  if (status != "complete") {
    return;
  }

  if (!client || !sub || !customer) {
    throw new Error(
      "Client ID, subscription ID e customer ID são obrigatorios!"
    );
  }

  const userExists = prisma.user.findUnique({
    where: { id: client },
    select: { id: true },
  });

  if (!userExists) {
    throw new Error("Usuario não existe.");
  }

  await prisma.user.update({
    where: {
      id: client,
    },
    data: {
      stripeCustomerID: customer,
      stripeSubscriptionID: sub,
      stripeSubscriptionStatus: status
    },
  });
}
