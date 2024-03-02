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
exports.UserController = void 0;
const Prisma_1 = __importDefault(require("../Configurations/Prisma"));
const Utils_1 = __importDefault(require("../Utils"));
class UserController {
    listUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield Prisma_1.default.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    stripeCustomerID: true,
                    stripeSubscriptionID: true,
                    stripeSubscriptionStatus: true,
                },
            });
            res.status(200).json({ users });
        });
    }
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: "ID invalido." });
            }
            const user = yield Prisma_1.default.user.findUnique({
                where: { id: id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            });
            if (!user) {
                return res.status(404).json({ message: "Usuario não encontrado." });
            }
            return res.status(200).json({ user });
        });
    }
    deleteOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: "ID invalido." });
            }
            const user = yield Prisma_1.default.user.findUnique({
                where: { id: id },
                select: {
                    id: true,
                },
            });
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
                return res.status(404).json({ message: "Impossivel deletar. Usuario não encontrado." });
            }
            yield Prisma_1.default.user
                .delete({ where: { id: user.id } })
                .then(() => {
                return res
                    .status(200)
                    .json({ message: "Usuario deletado com sucesso!" });
            })
                .catch((error) => {
                return res.status(400).json({ message: error });
            });
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, name, password } = req.body;
            if (!email || !name || !password) {
                return res
                    .status(400)
                    .json({ message: "Email, Nome e Senha são obrigatorios." });
            }
            const isEmailAlreadyExist = yield Prisma_1.default.user.findUnique({
                where: { email: email },
                select: {
                    id: true,
                },
            });
            if (isEmailAlreadyExist) {
                return res
                    .status(400)
                    .json({ message: "Já existe uma conta com esse e-email." });
            }
            const user = yield Prisma_1.default.user.create({
                data: { email: email, name: name },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });
            if (!user.name) {
                return;
            }
            let customer = yield Utils_1.default.Stripe.create_customer_if_not_exist({ email: user.email, name: user.name });
            yield Prisma_1.default.user.update({
                where: {
                    email: user.email,
                },
                data: {
                    stripeSubscriptionID: customer.id,
                },
            });
            return res.status(201).json({ user });
        });
    }
}
exports.UserController = UserController;
