import { Document, ObjectId } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: ROLE;
}

export interface IUSER extends Document {
  name: string;
  password: string;
  email: string;
  meterId: ObjectId;
  isVerified: boolean;
  phoneNumber: string;
}
export enum ROLE {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}
