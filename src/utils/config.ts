import { CorsOptions } from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
const whiteList = ["http://localhost:3000"];

export const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (whiteList.includes(requestOrigin as string) || !requestOrigin) {
      callback(null, requestOrigin);
    } else {
      callback(new Error("Cors error"));
    }
  },
  allowedHeaders: ["X-Requested-With", "content-type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
};

dotenv.config();
interface globalConfig {
  DB_URL: string;
  ACCESS_TOKEN_SECRET: string;
}

export const GlobalConfig: globalConfig = {
  DB_URL: process.env.DB_URL ?? "",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ?? "",
};

export async function checkRequiredEnvVars() {
  const vars = process.env;
  for (var r in GlobalConfig) {
    if (vars[r]?.trim() == "") {
      throw new Error(r + " is missing in env file");
    }
  }
}
export function castToObjectId(id: string): mongoose.Types.ObjectId {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  } else {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
}