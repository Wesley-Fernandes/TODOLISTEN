"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_controller_1 = require("./stripe-controller");
const test_controller_1 = require("./test-controller");
const todo_controller_1 = require("./todo-controller");
const user_controller_1 = require("./user-controller");
exports.default = {
    test: test_controller_1.TestController,
    user: user_controller_1.UserController,
    todo: todo_controller_1.TodoController,
    stripe: stripe_controller_1.StripeController
};
