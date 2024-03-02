"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../Controllers"));
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.user = new Controllers_1.default.user();
        this.router.get("/listar", this.user.listUsers);
        this.router.get("/:id", this.user.findOne);
        this.router.post("/registrar", this.user.createUser);
        this.router.delete("/:id", this.user.deleteOne);
    }
}
exports.UserRoutes = UserRoutes;
