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
exports.create_customer_if_not_exist = void 0;
const Stripe_1 = __importDefault(require("../../Configurations/Webhook/Stripe"));
const get_customer_by_id_1 = require("./get-customer-by-id");
const create_customer_if_not_exist = ({ email, name }) => __awaiter(void 0, void 0, void 0, function* () {
    let customer = yield (0, get_customer_by_id_1.get_customer_by_id)(email);
    if (customer) {
        return customer;
    }
    else {
        const newCustomer = yield Stripe_1.default.customers.create({ email, name });
        return newCustomer;
    }
});
exports.create_customer_if_not_exist = create_customer_if_not_exist;
