import { Request, Response, Router } from "express";
export const router = Router();
import { MeterController } from "./controller";
import { ROLE } from "../auth/types";
import { HttpStatusCode } from "../utils/globalTypes";
import CustomResponse from "../utils/wrapper";

const Controller = new MeterController();

router.post("/create", async (req: Request, res: Response) => {
  if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
    const response = await Controller.createMeter({
      userId: req.body.owner,
      gpsAddress: req.body.gpsAddress,
      meterType: req.body.meterType,
    });
    res.status(response.statusCode).send(response);

    return;
  }

  return res
    .status(HttpStatusCode.Forbidden)
    .send(
      new CustomResponse(HttpStatusCode.Forbidden, "Cannot perform task", false)
    );
});
router.get("/all", async (req: Request, res: Response) => {
  if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
    const response = await Controller.allMeters({
      ownerId: req.query["id"] as string,
    });
    res.status(response.statusCode).send(response);

    return;
  }

  return res
    .status(HttpStatusCode.Forbidden)
    .send(
      new CustomResponse(HttpStatusCode.Forbidden, "Cannot perform task", false)
    );
});
