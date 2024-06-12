import { Request, Response, Router } from "express";
import { AdminAuthController } from "./controller";
import { ROLE } from "../types";
import { HttpStatusCode } from "../../utils/globalTypes";
import CustomResponse from "../../utils/wrapper";
import { verifyToken } from "../../middleware/verify.middleware";
const Controller = new AdminAuthController();

export const router = Router();
router.post("/register", async (req: Request, res: Response) => {
  const response = await Controller.createAccount(
    req.body.name,
    req.body?.role,
    req.body.password,
    req.body.email
  );
  res.status(response.statusCode).send(response);
});
router.post("/login", async (req: Request, res: Response) => {
  const response = await Controller.login({
    email: req.body?.email,
    password: req.body?.password,
  });
  res.status(response.statusCode).send(response);
});

router.get("/details", verifyToken, async (req, res) => {
  const response = await Controller.getAdminInfo(req.body.userId);
  res.status(response.statusCode).send(response);
});

router.patch(
  "/verify-user",
  verifyToken,
  async (req: Request, res: Response) => {
    if (req.body.role == ROLE.ADMIN || req.body.role == ROLE.SUPER_ADMIN) {
      const response = await Controller.verifyRegisterdUser(req.body.id);
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
