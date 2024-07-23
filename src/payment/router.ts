import { Request, Response, Router } from "express";
import { PaymentController } from "./controller";
import { verifyToken } from "../middleware/verify.middleware";
import { ROLE } from "../auth/types";
import CustomResponse from "../utils/wrapper";
import { HttpStatusCode } from "../utils/globalTypes";

const Controller = new PaymentController();

export const router = Router();

router.post(
  "/record-payment",
  verifyToken,
  async (req: Request, res: Response) => {
    if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
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
    const response = await Controller.saveTranactionDetails({
      billingId: req.body.billingId,
      txnData: req.body.txnData,
      userId: req.body.userId,
    });
    res.status(response.statusCode).send(response);
  }
);
router.get(
  "/all-transactions",
  verifyToken,
  async (req: Request, res: Response) => {
    if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
      const response = await Controller.getAllTxns();
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

router.get(
  "/all-user-transactions",
  verifyToken,
  async (req: Request, res: Response) => {
    if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
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
    const response = await Controller.getAllUserTxns({
      userId: req.body.userId,
    });
    res.status(response.statusCode).send(response);
    return;
  }
);
