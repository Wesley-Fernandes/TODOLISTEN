"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeRoutes = void 0;
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../Controllers"));
class StripeRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.stripe = new Controllers_1.default.stripe();
        this.router.post("/checkout", this.stripe.createCheckout);
        //this.router.post("/webhook", this.stripe.weebHookUpdate)
    }
}
exports.StripeRoutes = StripeRoutes;
