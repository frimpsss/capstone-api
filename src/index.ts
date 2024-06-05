import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { checkRequiredEnvVars, corsOptions } from "./utils/config";
import { HttpStatusCode } from "./utils/globalTypes";
import { router as PostNotificationRouter } from "./push-notifs/routes";
import { router as AdminRouter } from "./auth/admin/routes";
import { router as MeterRouter } from "./meters/routes";
import { router as UserRouter } from "./auth/user/routes";
import mongoose from "mongoose";
import { connectDB } from "./utils/dbCon";
import { verifyToken } from "./middleware/verify.middleware";

dotenv.config();

// Ensure required environment variables are set
checkRequiredEnvVars().catch((error: any) => {
  console.error(error?.message);
  return;
});

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 9090;

app.use(express.json(), express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.use("/api", PostNotificationRouter);
app.use("/admin/auth", AdminRouter);
app.use("/user/auth", UserRouter);
app.use("/api/meter", verifyToken, MeterRouter);

app.all("/", (_req: Request, res: Response) => {
  return res.status(HttpStatusCode.Ok).send("Welcome to aquatrack api");
});

app.all("*", (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(HttpStatusCode.NotFound).send({
    status: false,
    message: "Route not found",
  });
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server up and spinning on port: ${port}`);
    });
  })
  .catch((error: any) => {
    console.error(error?.message);
    return;
  });

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  // sentry or sth for production
  console.error(error?.message);
  res
    .status(HttpStatusCode.InternalServerError)
    .send("Don't fret. We are checking it out asap!");
});

mongoose.connection.once("connected", () => {
  console.log("Connected to the database");
});
