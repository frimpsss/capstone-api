import { Request, Response, Router } from "express";
import { PostNotification } from "./controller";
import { verifyToken } from "../middleware/verify.middleware";
import { ROLE } from "../auth/types";
import { HttpStatusCode } from "../utils/globalTypes";
import CustomResponse from "../utils/wrapper";
const MessagingController = new PostNotification();

export const router = Router();

router.post(
  "/send-notification",
  verifyToken,
  async (req: Request, res: Response) => {
    if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
      const response = await MessagingController.sendMessage(
        req.body.title,
        req.body.body,
        req.body.reciepient
      );
      res.status(response.statusCode).send(response);

      return;
    }

    return res
      .status(HttpStatusCode.Forbidden)
      .send(
        new CustomResponse(
          HttpStatusCode.Forbidden,
          "Cannot perform task",
          false
        )
      );
  }
);
router.post(
  "/register-token",
  verifyToken,
  async (req: Request, res: Response) => {
    const response = await MessagingController.registerPushToken(
      req.body.userId,
      req.body.token
    );
    res.status(response.statusCode).send(response);
  }
);
