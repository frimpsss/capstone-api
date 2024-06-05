import { Response, NextFunction, Request } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { HttpStatusCode } from "../utils/globalTypes";
import { GlobalConfig } from "../utils/config";
import { ROLE } from "../auth/types";
export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token: string | undefined =
      req?.headers?.["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "no auth header",
      });
    }

    const decodedPayload = jwt.verify(
      token,
      GlobalConfig.ACCESS_TOKEN_SECRET
    ) as { userId: string; role: ROLE };
    req.body.userId = decodedPayload.userId;
    req.body.role = decodedPayload.role;
    next();
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      return res.status(HttpStatusCode.Forbidden).send({
        status: false,
        message: "expired_token",
      });
    }
    if (error instanceof JsonWebTokenError) {
      return res.status(HttpStatusCode.Unauthorized).send({
        status: false,
        message: "unauthorized",
      });
    }
    return res.status(HttpStatusCode.InternalServerError).send({
      status: false,
      message: error?.message,
    });
  }
}
