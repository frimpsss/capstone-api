import mongoose, { Schema, SchemaTypes } from "mongoose";
import { IMeter, IMeterType } from "./type";

const MeterSchema = new Schema<IMeter>(
  {
    userId: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    gpsAddress: {
      type: SchemaTypes.String,
      required: true,
    },
    meterType: {
      type: SchemaTypes.String,
      enum: IMeterType,
      required: true,
    },
  },
  { timestamps: true }
);

export const MeterModel = mongoose.model<IMeter>("Meter", MeterSchema);
