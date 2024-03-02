import { Request, Response } from "express";
import { CreateUserTypes } from "../@types/user.types";
import stripe from "../Configurations/Webhook/Stripe";
import prisma from "../Configurations/Prisma";
import Utils from "../Utils";

export class UserController {
  async listUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany({
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
  }

  async findOne(req: Request, res: Response) {
    const id: string = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "ID invalido." });
    }
    const user = await prisma.user.findUnique({
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
  }

  async deleteOne(req: Request, res: Response) {
    const id: string = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "ID invalido." });
    }
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    });

    if (!user?.id) {
      return res.status(404).json({ message: "Impossivel deletar. Usuario não encontrado." });
    }

    await prisma.user
      .delete({ where: { id: user.id } })
      .then(() => {
        return res
          .status(200)
          .json({ message: "Usuario deletado com sucesso!" });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
    
  }
  async createUser(req: Request, res: Response) {
    const { email, name, password }: CreateUserTypes = req.body;
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ message: "Email, Nome e Senha são obrigatorios." });
    }

    const isEmailAlreadyExist = await prisma.user.findUnique({
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

    const user = await prisma.user.create({
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

    let customer = await Utils.Stripe.create_customer_if_not_exist({email: user.email, name: user.name});

    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        stripeSubscriptionID: customer.id,
      },
    });

    return res.status(201).json({ user });
  }
}
