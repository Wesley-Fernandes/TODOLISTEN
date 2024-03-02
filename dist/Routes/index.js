"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_routes_1 = require("./test-routes");
const user_routes_1 = require("./user-routes");
const todo_routes_1 = require("./todo-routes");
const stripe_routes_1 = require("./stripe-routes");
class Routes {
    constructor() {
        this.route = (0, express_1.Router)();
        this.test = new test_routes_1.TestRoutes();
        this.user = new user_routes_1.UserRoutes();
        this.todo = new todo_routes_1.TodoRoutes();
        this.stripe = new stripe_routes_1.StripeRoutes();
        this.route.use("/test", this.test.router);
        this.route.use("/usuario", this.user.router);
        this.route.use("/todo", this.todo.router);
        this.route.use("/stripe", this.stripe.router);
    }
}
exports.default = Routes;
