import { Request, Response, Router } from "express";
import { ReportController } from "./controller";
import { ROLE } from "../auth/types";
import { HttpStatusCode } from "../utils/globalTypes";
import CustomResponse from "../utils/wrapper";
import { verifyToken } from "../middleware/verify.middleware";

const Kontroller = new ReportController();
export const router = Router();

router.post("/create", verifyToken, async (req: Request, res: Response) => {
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
  const response = await Kontroller.createReport({
    title: req.body.title,
    userId: req.body.userId,
    description: req.body.description,
    images: req.body.images,
  });
  res.status(response.statusCode).send(response);

  return;
});

router.patch("/attend-to", verifyToken, async (req: Request, res: Response) => {
  if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
    const response = await Kontroller.attendToReport({
      id: req.body.reportId,
      remarks: req.body.remarks,
    });
    return res.status(response.statusCode).send(response);
  }
  return res
    .status(HttpStatusCode.Forbidden)
    .send(
      new CustomResponse(HttpStatusCode.Forbidden, "Cannot perform task", false)
    );
});

router.get("/all-reports", verifyToken, async (req: Request, res: Response) => {
  if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
    const response = await Kontroller.getAllReports();
    return res.status(response.statusCode).send(response);
  }
  return res
    .status(HttpStatusCode.Forbidden)
    .send(
      new CustomResponse(HttpStatusCode.Forbidden, "Cannot perform task", false)
    );
});
