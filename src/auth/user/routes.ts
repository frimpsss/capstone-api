import { Request, Response, Router } from "express";
import { UserAuthController } from "./controller";
import { verifyToken } from "../../middleware/verify.middleware";
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

router.post("/login", async (req: Request, res: Response) => {
  const response = await Controller.login({
    email: req.body.email,
    password: req.body.password,
  });
  res.status(response.statusCode).send(response);
});

router.get("/details", verifyToken, async (req: Request, res: Response) => {
  const response = await Controller.getUserDetails(req.body.userId);
  res.status(response.statusCode).send(response);
});

