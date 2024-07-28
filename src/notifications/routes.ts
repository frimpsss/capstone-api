import { Request, Response, Router } from "express";
import { NotificationController } from "./controller";
import { ROLE } from "../auth/types";
import { HttpStatusCode } from "../utils/globalTypes";
import CustomResponse from "../utils/wrapper";
const Controller = new NotificationController();
export const router = Router();

router.post("/create", async (_req: Request, _res: Response) => {
  if (_req.body.role == ROLE.ADMIN || _req.body.role == ROLE.SUPER_ADMIN) {
    const response = await Controller.createNotification({
      message: _req.body.message,
      title: _req.body.title,
      notifType: _req.body.type,
      recipientId: _req.body.recipientId,
      sendPushNotif: _req.body.pushNotif,
    });
    _res.status(response.statusCode).send(response);

    return;
  }

  return _res
    .status(HttpStatusCode.Forbidden)
    .send(
      new CustomResponse(HttpStatusCode.Forbidden, "Cannot perform task", false)
    );
});

router.get("/all-notification", async (_req: Request, _res: Response) => {
  if (_req.body.role == ROLE.ADMIN || _req.body.role == ROLE.SUPER_ADMIN) {
    const response = await Controller.getAllNotifications({
      notificationType: _req.query["type"] as any,
      userId: _req.query["userId"] as any,
    });
    _res.status(response.statusCode).send(response);

    return;
  }

  const response = await Controller.getAllNotifications({
    notificationType: _req.query["type"] as any,
    userId: _req.body.userId,
  });
  _res.status(response.statusCode).send(response);
});
