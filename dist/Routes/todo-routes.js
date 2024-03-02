"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoRoutes = void 0;
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../Controllers"));
class TodoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.todo = new Controllers_1.default.todo();
        this.router.get("/listar", this.todo.listAll);
        this.router.post("/criar", this.todo.createOne);
        this.router.get("/encontrar/:id", this.todo.findOne);
        this.router.delete("/deletar/:id", this.todo.deleteOne);
    }
}
exports.TodoRoutes = TodoRoutes;
