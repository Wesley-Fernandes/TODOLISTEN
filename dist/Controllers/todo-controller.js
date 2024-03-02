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
exports.TodoController = void 0;
const Prisma_1 = __importDefault(require("../Configurations/Prisma"));
class TodoController {
    listAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.headers["x-user-id"];
            if (!userID || typeof userID != "string") {
                return res
                    .status(403)
                    .json({ message: "Você não está autorizado a acessar. 1" });
            }
            const todos = yield Prisma_1.default.todo.findMany({ where: { ownerID: userID } });
            return res.status(200).json({ todos });
        });
    }
    createOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.headers["x-user-id"];
            const { title } = req.body;
            if (!userID || typeof userID !== "string") {
                return res.status(403).json({ message: "Você não está autorizado!" });
            }
            const user = yield Prisma_1.default.user.findUnique({
                where: { id: userID },
                select: {
                    id: true,
                    stripeSubscriptionStatus: true,
                    stripeCustomerID: true,
                    _count: {
                        select: {
                            todo: true,
                        },
                    },
                },
            });
            if (!user) {
                return res.status(403).json({ message: "Você não está autorizado!" });
            }
            const has_todo_quota = user._count.todo < 2;
            const has_active_subscription = user.stripeCustomerID && user.stripeSubscriptionStatus != "active";
            if (!has_active_subscription || !has_todo_quota) {
                return res.status(400).json({
                    message: "Você atingiu o maximo de tarefas. Atualize seu plano!",
                });
            }
            if (!title) {
                return res.status(400).json({ message: "Titulo é obrigatorio." });
            }
            const todo = yield Prisma_1.default.todo.create({
                data: {
                    title: title,
                    ownerID: user.id,
                },
            });
            return res.status(201).json({ todo });
        });
    }
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.headers["x-user-id"];
            const id = req.params.id;
            if (!userID || typeof userID !== "string") {
                return res.status(403).json({ message: "Você não está autorizado!" });
            }
            const user = yield Prisma_1.default.user.findUnique({ where: { id: userID } });
            if (!user || !user.id) {
                return res.status(403).json({ message: "Você não está autorizado!" });
            }
            const todo = yield Prisma_1.default.todo.findUnique({
                where: { id },
            });
            return res.status(200).json({ todo });
        });
    }
    deleteOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.headers["x-user-id"];
            const id = req.params.id;
            if (!userID || typeof userID !== "string") {
                return res.status(403).json({ message: "Você não está autorizado!" });
            }
            const user = yield Prisma_1.default.user.findUnique({ where: { id: userID } });
            if (!user || !user.id) {
                return res.status(403).json({ message: "Você não está autorizado!" });
            }
            const todo = yield Prisma_1.default.todo.delete({
                where: {
                    id,
                    ownerID: user.id,
                },
            });
            return res.status(200).json({ message: "Tarefa deletada com sucesso!" });
        });
    }
}
exports.TodoController = TodoController;
