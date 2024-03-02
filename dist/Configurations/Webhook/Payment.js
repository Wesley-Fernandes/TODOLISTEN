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
exports.Payment = void 0;
const Utils_1 = __importDefault(require("../../Utils"));
const Variables_1 = __importDefault(require("../Variables"));
const Stripe_1 = __importDefault(require("./Stripe"));
function Payment(userID, userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let customer = yield Utils_1.default.Stripe.get_customer_by_id(userEmail);
            if (!customer) {
                customer = yield Stripe_1.default.customers.create({
                    email: userEmail,
                });
            }
            const session = yield Stripe_1.default.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price: Variables_1.default.stripe.proPrice,
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
        }
        catch (error) {
            console.error(error);
            return { status: 400, error };
        }
    });
}
exports.Payment = Payment;
