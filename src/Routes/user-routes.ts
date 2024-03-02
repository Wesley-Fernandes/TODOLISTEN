import { Router } from "express";
import Controllers from "../Controllers";

export class UserRoutes {
  public router = Router();
  private readonly user = new Controllers.user();

  constructor() {
    this.router.get("/listar", this.user.listUsers);
    this.router.get("/:id", this.user.findOne);
    this.router.post("/registrar", this.user.createUser);
    this.router.delete("/:id", this.user.deleteOne);
  }
}
