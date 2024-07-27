import { Document, ObjectId } from "mongoose";

export interface IReport extends Document {
  userId: ObjectId;
  title: string;
  description: string;
  images: string[];
  attendedTo?: boolean;
  remarks?: string;
}
