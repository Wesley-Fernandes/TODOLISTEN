import { Router } from "express";
import Controllers from "../Controllers";

export class TodoRoutes {
  public router = Router();
  private readonly todo = new Controllers.todo();

  constructor() {
    this.router.get("/listar", this.todo.listAll);
    this.router.post("/criar", this.todo.createOne);
    this.router.get("/encontrar/:id", this.todo.findOne);
    this.router.delete("/deletar/:id", this.todo.deleteOne);
  }
}
