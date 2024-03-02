import "dotenv/config";
import express from "express";
import Routes from "../Routes";
import { StripeController } from "../Controllers/stripe-controller";

class Server {
  private readonly express = express();
  private readonly PORT = 4041;
  //-----------------ROUTES----------------
  private readonly routes = new Routes();
  private readonly stripe = new StripeController();

  constructor() {
    this.express.use(
      "/stripe/webhook",
      express.raw({ type: "application/json" }),
      this.stripe.weebHookUpdate
    );
    this.express.use(express.json());
    this.express.use("/api", this.routes.route);
  }

  execute() {
    this.express.listen(this.PORT, () => {
      console.log(`Servidor rodando na porta: ${this.PORT}`);
    });
  }
}

export default Server;
