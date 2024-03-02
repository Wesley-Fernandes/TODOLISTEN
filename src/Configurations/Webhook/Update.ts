import { StripeWebhookSubscription } from "../../@types/stripe.types";
import Utils from "../../Utils";
import prisma from "../Prisma";

export async function Update(event: StripeWebhookSubscription) {
  const status = event.data.object.status;
  const customer = event.data.object.customer as string;
  const sub = event.data.object.id as string;

  if (!status || !sub || !customer) {
    return Utils.Stripe.call_new_error(
      "Status, subscription ID e customer ID são obrigatorios!"
    );
  }

  const user = await prisma.user.findFirst({
    where: { stripeCustomerID: customer },
    select: { id: true },
  });

  if (!user) {
    return Utils.Stripe.call_new_error("Usuario não encontrado.");
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      stripeCustomerID: customer,
      stripeSubscriptionID: sub,
      stripeSubscriptionStatus: status,
    },
  });
}
