import mongoose, { Schema, SchemaTypes } from "mongoose";
import { IAdmin, IUSER, ROLE } from "./types";

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
    },
    password: {
      type: SchemaTypes.String,
      required: true,
    },
    name: {
      type: SchemaTypes.String,
      required: true,
    },
    role: {
      type: SchemaTypes.String,
      enum: ROLE,
      required: true,
    },
  },
  { timestamps: true }
);

const UserSchema = new Schema<IUSER>(
  {
    email: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
    },
    password: {
      type: SchemaTypes.String,
      required: true,
    },
    name: {
      type: SchemaTypes.String,
      required: true,
    },
    meterId: {
      type: SchemaTypes.ObjectId,
      ref: "Meter",
      required: false,
    },
    isVerified: {
      type: SchemaTypes.Boolean,
      default: false,
    },
    phoneNumber: {
      type: SchemaTypes.String,
      required: true,
    },
  },
  { timestamps: true }
);

export const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema);
export const UserModel = mongoose.model<IUSER>("User", UserSchema);
