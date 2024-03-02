import { StripeController } from "./stripe-controller";
import { TestController } from "./test-controller";
import { TodoController } from "./todo-controller";
import { UserController } from "./user-controller";

export default {
  test: TestController,
  user: UserController,
  todo: TodoController,
  stripe: StripeController
};
