import { Router } from "express";
import Controllers from "../Controllers";

export class StripeRoutes {
  public router = Router();
  public stripe = new Controllers.stripe();

  constructor() {
    this.router.post("/checkout", this.stripe.createCheckout);
    //this.router.post("/webhook", this.stripe.weebHookUpdate)
  }
}
