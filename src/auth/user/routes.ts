import { Request, Response, Router } from "express";
import { UserAuthController } from "./controller";
const Controller = new UserAuthController();

export const router = Router();
router.post("/register", async (req: Request, res: Response) => {
  const response = await Controller.register({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
  });
  res.status(response.statusCode).send(response);
});
