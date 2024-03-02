import { Router } from "express";
import Controllers from "../Controllers";

export class TestRoutes {
  public router = Router();
  private readonly test = new Controllers.test();

  constructor() {
    this.router.get("/", this.test.isOnline);
  }
}
