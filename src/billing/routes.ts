import { Request, Response, Router } from "express";
import { BillController } from "./controller";
import { HttpStatusCode } from "../utils/globalTypes";
import CustomResponse from "../utils/wrapper";
import { ROLE } from "../auth/types";
import { verifyToken } from "../middleware/verify.middleware";
export const router = Router();

const Controller = new BillController();

router.post("/generate", verifyToken, async (req, res) => {
  if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
    const response = await Controller.generateBills({
      billingPeriodEnd: req.body.endDate,
      billingPeriodStart: req.body.startDate,
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

router.get("/user-bills", verifyToken, async (req, res) => {
  if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
    const response = await Controller.getIndividialsBills({
      userId: req.body.user,
    });
    res.status(response.statusCode).send(response);

    return;
  }

  const response = await Controller.getIndividialsBills({
    userId: req.body.userId,
  });
  res.status(response.statusCode).send(response);
});
