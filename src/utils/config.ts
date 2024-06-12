import { CorsOptions } from "cors";
import mongoose from "mongoose";
import os from "os";
import dotenv from "dotenv";
const whiteList = [
  "http://localhost:3000",
  "*",
  "http://localhost:5173",
  "https://water-web-green.vercel.app",
];

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
  DB_URL: process.env.DATABASE_URL ?? "",
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

export function getLocalIP() {
  const interfaces: any = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e., 127.0.0.1) addresses
      if (net.family === "IPv4" && !net.internal) {
        addresses.push(net.address);
      }
    }
  }

  return addresses.length ? addresses[0] : null;
}
