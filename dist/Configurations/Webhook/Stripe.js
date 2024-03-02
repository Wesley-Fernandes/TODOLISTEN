"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const Variables_1 = __importDefault(require("../Variables"));
const stripe = new stripe_1.default(Variables_1.default.stripe.secretKey, {
    apiVersion: "2023-10-16",
    httpClient: stripe_1.default.createFetchHttpClient(),
});
exports.default = stripe;
