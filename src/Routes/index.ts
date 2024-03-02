import { Router } from "express";
import { TestRoutes } from "./test-routes";
import { UserRoutes } from "./user-routes";
import { TodoRoutes } from "./todo-routes";
import { StripeRoutes } from "./stripe-routes";

class Routes {
  public readonly route = Router();
  private test = new TestRoutes();
  private user = new UserRoutes();
  private todo = new TodoRoutes();
  private stripe = new StripeRoutes();
  constructor() {
    this.route.use("/test", this.test.router);
    this.route.use("/usuario", this.user.router);
    this.route.use("/todo", this.todo.router);
    this.route.use("/stripe", this.stripe.router);
  }
}

export default Routes;
