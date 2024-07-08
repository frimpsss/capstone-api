import { Request, Response, Router } from "express";
import { TariffController } from "./controller";
import { verifyToken } from "../middleware/verify.middleware";
import { ROLE } from "../auth/types";
import { HttpStatusCode } from "../utils/globalTypes";
import CustomResponse from "../utils/wrapper";

const Controller = new TariffController();
export const router = Router();

router.post("/create", verifyToken, async (req: Request, res: Response) => {
  if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
    const response = await Controller.createTariff({
      name: req.body.name,
      description: req.body.description,
      effectiveFrom: req.body.effectiveFrom,
      effectiveTo: req.body.effectiveTo,
      rate: req.body.rate,
    });

    return res.status(response.statusCode).send(response);
  }

  return res
    .status(HttpStatusCode.Forbidden)
    .send(
      new CustomResponse(HttpStatusCode.Forbidden, "Cannot perform task", false)
    );
});

router.get("/current", verifyToken, async (req: Request, res: Response) => {
  if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
    const response = await Controller.getActiveTariffs();

    return res.status(response.statusCode).send(response);
  }

  return res
    .status(HttpStatusCode.Forbidden)
    .send(
      new CustomResponse(HttpStatusCode.Forbidden, "Cannot perform task", false)
    );
});

router.patch("/toggle", verifyToken, async (req: Request, res: Response) => {
  if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
    const response = await Controller.toggleTariffStatus(req.body.tariffId);

    return res.status(response.statusCode).send(response);
  }

  return res
    .status(HttpStatusCode.Forbidden)
    .send(
      new CustomResponse(HttpStatusCode.Forbidden, "Cannot perform task", false)
    );
});

router.get("/tariffs", verifyToken, async (req: Request, res: Response) => {
  if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
    const response = await Controller.getAllTariffs();

    return res.status(response.statusCode).send(response);
  }

  return res
    .status(HttpStatusCode.Forbidden)
    .send(
      new CustomResponse(HttpStatusCode.Forbidden, "Cannot perform task", false)
    );
});
