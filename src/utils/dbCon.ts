import mongoose from "mongoose";
import { GlobalConfig, checkRequiredEnvVars } from "./config";

export async function connectDB() {
  try {
    await checkRequiredEnvVars();
    await mongoose.connect(GlobalConfig.DB_URL, {});
  } catch (error: any) {
    throw new Error(error);
  }
}
