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
exports.Update = void 0;
const Utils_1 = __importDefault(require("../../Utils"));
const Prisma_1 = __importDefault(require("../Prisma"));
function Update(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const status = event.data.object.status;
        const customer = event.data.object.customer;
        const sub = event.data.object.id;
        if (!status || !sub || !customer) {
            return Utils_1.default.Stripe.call_new_error("Status, subscription ID e customer ID são obrigatorios!");
        }
        const user = yield Prisma_1.default.user.findFirst({
            where: { stripeCustomerID: customer },
            select: { id: true },
        });
        if (!user) {
            return Utils_1.default.Stripe.call_new_error("Usuario não encontrado.");
        }
        yield Prisma_1.default.user.update({
            where: {
                id: user.id,
            },
            data: {
                stripeCustomerID: customer,
                stripeSubscriptionID: sub,
                stripeSubscriptionStatus: status,
            },
        });
    });
}
exports.Update = Update;
