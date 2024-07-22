import mongoose, { Schema, SchemaTypes } from "mongoose";
import {
  ITariff,
  IUPDATE,
  RATE_CHANGE_TYPE,
  STATUS_CHANGE_TYPE,
  TariffStatus,
} from "./type";
export const RateChangeSchema = new Schema<RATE_CHANGE_TYPE>({
  oldRate: { type: SchemaTypes.Number, required: true },
  newRate: { type: SchemaTypes.Number, required: true },
  effectiveFrom: { type: SchemaTypes.Date, required: true },
  effectiveTo: { type: SchemaTypes.Date, required: true },
  date: { type: SchemaTypes.Date, required: true },
});

export const StatusChangeSchema = new Schema<STATUS_CHANGE_TYPE>({
  oldStatus: { type: SchemaTypes.String, required: true, enum: TariffStatus },
  newStatus: { type: SchemaTypes.String, required: true, enum: TariffStatus },
  date: { type: SchemaTypes.Date, required: true },
});

const UpdateSchema = new Schema<IUPDATE>({
  type: { type: String, enum: ["rate", "status"], required: true },
  updates: {
    type: SchemaTypes.Mixed,
    required: true,
  },
});

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
    updateHistory: {
      type: [UpdateSchema],
      default: [],
      required: false,
    },
  },
  { timestamps: true }
);

export const TarrifModel = mongoose.model<ITariff>("Tariff", TariffSchema);
