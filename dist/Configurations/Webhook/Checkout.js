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
exports.Checkout = void 0;
const Prisma_1 = __importDefault(require("../Prisma"));
function Checkout(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = event.data.object.client_reference_id;
        const sub = event.data.object.subscription;
        const customer = event.data.object.customer;
        const status = event.data.object.status;
        if (status != "complete") {
            return;
        }
        if (!client || !sub || !customer) {
            throw new Error("Client ID, subscription ID e customer ID são obrigatorios!");
        }
        const userExists = Prisma_1.default.user.findUnique({
            where: { id: client },
            select: { id: true },
        });
        if (!userExists) {
            throw new Error("Usuario não existe.");
        }
        yield Prisma_1.default.user.update({
            where: {
                id: client,
            },
            data: {
                stripeCustomerID: customer,
                stripeSubscriptionID: sub,
                stripeSubscriptionStatus: status
            },
        });
    });
}
exports.Checkout = Checkout;
