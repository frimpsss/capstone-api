import { Request, Response, Router, response } from "express";
import { PostNotification } from "./controller";
const MessagingController = new PostNotification();

export const router = Router();

router.post("/send-notification", async (req: Request, res: Response) => {
  const response = await MessagingController.sendMessage(
    req.body.title,
    req.body.body,
    req.body.token
  );
  res.status(response.statusCode).send(response);
});
router.post("/register-token", async (req: Request, res: Response) => {
  const response = await MessagingController.registerPushToken(
    req.body.userId,
    req.body.token
  );
  res.status(response.statusCode).send(response);
});
