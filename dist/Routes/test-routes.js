"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRoutes = void 0;
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../Controllers"));
class TestRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.test = new Controllers_1.default.test();
        this.router.get("/", this.test.isOnline);
    }
}
exports.TestRoutes = TestRoutes;
