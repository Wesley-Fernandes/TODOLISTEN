"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const Routes_1 = __importDefault(require("../Routes"));
const stripe_controller_1 = require("../Controllers/stripe-controller");
class Server {
    constructor() {
        this.express = (0, express_1.default)();
        this.PORT = 4041;
        //-----------------ROUTES----------------
        this.routes = new Routes_1.default();
        this.stripe = new stripe_controller_1.StripeController();
        this.express.use("/stripe/webhook", express_1.default.raw({ type: "application/json" }), this.stripe.weebHookUpdate);
        this.express.use(express_1.default.json());
        this.express.use("/api", this.routes.route);
    }
    execute() {
        this.express.listen(this.PORT, () => {
            console.log(`Servidor rodando na porta: ${this.PORT}`);
        });
    }
}
exports.default = Server;
