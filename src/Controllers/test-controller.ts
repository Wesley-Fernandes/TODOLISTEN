import { Request, Response } from "express";


export class TestController {
  isOnline(req: Request, res: Response) {
    res.status(200).json({ message: "Is online" });
  }
}


