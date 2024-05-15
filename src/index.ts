import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { corsOptions } from "./utils/config";
import { HttpStatusCode } from "./utils/globalTypes";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT as string, 10) || 9090;
app.use(
  express.json(),
  express.urlencoded({ extended: true }),
  bodyParser.json()
);

app.use(cors(corsOptions));

app.all("/", (req: Request, res: Response) => {
  return res.status(HttpStatusCode.Ok).send("Welcome to aquatrack api");
});
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return res.status(HttpStatusCode.NotFound).send({
    status: false,
    message: "Route not found",
  });
});

app.listen(port, () => {
  console.log(`Server up and spinning on port: ${port}`);
});
