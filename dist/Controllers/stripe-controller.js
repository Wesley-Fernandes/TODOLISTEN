"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const Prisma_1 = __importDefault(require("../Configurations/Prisma"));
const Webhook_1 = __importDefault(require("../Configurations/Webhook"));
const Variables_1 = __importDefault(require("../Configurations/Variables"));
const Stripe_1 = __importDefault(require("../Configurations/Webhook/Stripe"));
class StripeController {
    createCheckout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.headers["x-user-id"];
            if (!userID || typeof userID !== "string") {
                return res.status(403).json({ message: "Você não está autorizado!" });
            }
            const user = yield Prisma_1.default.user.findUnique({
                where: { id: userID },
                select: { id: true, email: true },
            });
            if (!user) {
                return res.status(403).json({ message: "Você não está autorizado!" });
            }
            const checkout = yield Webhook_1.default.Payment(user.id, user.email);
            yield Prisma_1.default.user.update({
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
        });
    }
    weebHookUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let event = req.body;
            if (!Variables_1.default.stripe.webHookSecret) {
                console.error("Chave secreta do stripe não foi configurada.");
                return res.status(500).send("Webhook secret not found!");
            }
            const signature = req.headers["stripe-signature"];
            try {
                event = yield Stripe_1.default.webhooks.constructEventAsync(req.body, signature, Variables_1.default.stripe.webHookSecret, undefined, stripe_1.default.createSubtleCryptoProvider());
            }
            catch (err) {
                const errorMsg = err instanceof Error ? err.message : "Erro desconhecido.";
                console.error("Erro na assinatura do Webhook.", errorMsg);
                return res.status(400).send(errorMsg);
            }
            try {
                switch (event.type) {
                    case "checkout.session.completed":
                        //const checkoutSessionCompleted = event.data.object;
                        console.log("evento conhecido:", event.type);
                        yield Webhook_1.default.Checkout(event);
                        break;
                    case "customer.subscription.created":
                        //const customerSubscriptionCreated = event.data.object;
                        console.log("evento conhecido:", event.type);
                        break;
                    case "customer.subscription.updated":
                        //const customerSubscriptionUpdated = event.data.object;
                        console.log("evento conhecido:", event.type);
                        yield Webhook_1.default.Update(event);
                        break;
                    default:
                    //console.log(`Unhandled event type ${event.type}`);
                }
                return res.status(201).end();
            }
            catch (error) {
                console.log(`Unhandled error: ${error}`);
                return res.status(500).send(error);
            }
        });
    }
}
exports.StripeController = StripeController;
