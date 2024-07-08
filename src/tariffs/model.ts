import mongoose, { Schema, SchemaTypes } from "mongoose";
import { ITariff, TariffStatus } from "./type";

const TariffSchema = new Schema<ITariff>(
  {
    name: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
    },
    rate: {
      type: SchemaTypes.Number,
      required: true,
    },
    description: {
      type: SchemaTypes.String,
      required: true,
    },
    effectiveFrom: {
      type: SchemaTypes.Date,
      required: true,
    },
    effectiveTo: {
      type: SchemaTypes.Date,
    },

    status: {
      type: SchemaTypes.String,
      required: true,
      enum: TariffStatus,
    },
  },
  { timestamps: true }
);

export const TarrifModel = mongoose.model<ITariff>("Tariff", TariffSchema);
