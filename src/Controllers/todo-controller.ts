import { Request, Response } from "express";
import prisma from "../Configurations/Prisma";
import { createTodoType } from "../@types/todo.types";

export class TodoController {
  async listAll(req: Request, res: Response) {
    const userID = req.headers["x-user-id"];
    if (!userID || typeof userID != "string") {
      return res
        .status(403)
        .json({ message: "Você não está autorizado a acessar. 1" });
    }

    const todos = await prisma.todo.findMany({ where: { ownerID: userID } });
    return res.status(200).json({ todos });
  }

  async createOne(req: Request, res: Response) {
    const userID = req.headers["x-user-id"];
    const { title }: createTodoType = req.body;

    if (!userID || typeof userID !== "string") {
      return res.status(403).json({ message: "Você não está autorizado!" });
    }

    const user = await prisma.user.findUnique({
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
    const has_active_subscription =
      user.stripeCustomerID && user.stripeSubscriptionStatus != "active";

    if (!has_active_subscription || !has_todo_quota) {
      return res.status(400).json({
        message: "Você atingiu o maximo de tarefas. Atualize seu plano!",
      });
    }

    if (!title) {
      return res.status(400).json({ message: "Titulo é obrigatorio." });
    }

    const todo = await prisma.todo.create({
      data: {
        title: title,
        ownerID: user.id,
      },
    });

    return res.status(201).json({ todo });
  }

  async findOne(req: Request, res: Response) {
    const userID = req.headers["x-user-id"];
    const id: string = req.params.id;

    if (!userID || typeof userID !== "string") {
      return res.status(403).json({ message: "Você não está autorizado!" });
    }

    const user = await prisma.user.findUnique({ where: { id: userID } });

    if (!user || !user.id) {
      return res.status(403).json({ message: "Você não está autorizado!" });
    }

    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    return res.status(200).json({ todo });
  }

  async deleteOne(req: Request, res: Response) {
    const userID = req.headers["x-user-id"];
    const id: string = req.params.id;

    if (!userID || typeof userID !== "string") {
      return res.status(403).json({ message: "Você não está autorizado!" });
    }

    const user = await prisma.user.findUnique({ where: { id: userID } });

    if (!user || !user.id) {
      return res.status(403).json({ message: "Você não está autorizado!" });
    }

    const todo = await prisma.todo.delete({
      where: {
        id,
        ownerID: user.id,
      },
    });

    return res.status(200).json({ message: "Tarefa deletada com sucesso!" });
  }
}
