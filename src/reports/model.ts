import mongoose, { model, Schema, SchemaTypes } from "mongoose";
import { IReport } from "./types";

const ReportSchema = new Schema<IReport>(
  {
    userId: {
      required: true,
      ref: "User",
      type: SchemaTypes.ObjectId,
    },
    title: {
      required: true,
      type: SchemaTypes.String,
    },
    description: {
      required: true,
      type: SchemaTypes.String,
    },
    images: {
      required: false,
      type: [SchemaTypes.String],
    },
  },
  { timestamps: true }
);

export const ReportModel = mongoose.model<IReport>("Report", ReportSchema);
