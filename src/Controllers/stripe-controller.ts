import Stripe from "stripe";
import { Request, Response } from "express";
import prisma from "../Configurations/Prisma";
import Webhook from "../Configurations/Webhook";
import Variables from "../Configurations/Variables";
import stripe from "../Configurations/Webhook/Stripe";

export class StripeController {
  async createCheckout(req: Request, res: Response) {
    const userID = req.headers["x-user-id"];

    if (!userID || typeof userID !== "string") {
      return res.status(403).json({ message: "Você não está autorizado!" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userID },
      select: { id: true, email: true },
    });

    if (!user) {
      return res.status(403).json({ message: "Você não está autorizado!" });
    }

    const checkout = await Webhook.Payment(user.id, user.email);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripeSubscriptionID: checkout.customerID,
      },
    });
    return res
      .status(checkout.status)
      .json({ result: checkout.url || checkout.error });
  }

  async weebHookUpdate(req: Request, res: Response) {
    let event = req.body;

    if (!Variables.stripe.webHookSecret) {
      console.error("Chave secreta do stripe não foi configurada.");
      return res.status(500).send("Webhook secret not found!");
    }

    const signature = req.headers["stripe-signature"] as string;

    try {
      event = await stripe.webhooks.constructEventAsync(
        req.body,
        signature,
        Variables.stripe.webHookSecret,
        undefined,
        Stripe.createSubtleCryptoProvider()
      );
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Erro desconhecido.";
      console.error("Erro na assinatura do Webhook.", errorMsg);
      return res.status(400).send(errorMsg);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
          //const checkoutSessionCompleted = event.data.object;
          console.log("evento conhecido:", event.type);
          await Webhook.Checkout(event);
          break;
        case "customer.subscription.created":
          //const customerSubscriptionCreated = event.data.object;
          console.log("evento conhecido:", event.type);
          break;
        case "customer.subscription.updated":
          //const customerSubscriptionUpdated = event.data.object;
          console.log("evento conhecido:", event.type);
          await Webhook.Update(event);
          break;
        default:
        //console.log(`Unhandled event type ${event.type}`);
      }

      return res.status(201).end();
    } catch (error) {
      console.log(`Unhandled error: ${error}`);
      return res.status(500).send(error);
    }
  }
}
