import { Document, ObjectId } from "mongoose";
export interface IMeter extends Document {
  userId: ObjectId;
  gpsAddress: string;
}
