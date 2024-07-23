import mongoose, { Schema, SchemaTypes } from "mongoose";
import { BillStatus, IBill } from "./types";

const BillSchema = new Schema<IBill>(
  {
    meterId: {
      type: SchemaTypes.ObjectId,
      ref: "Meter",
      required: true,
    },
    billingPeriodStart: {
      type: SchemaTypes.Date,
      required: true,
    },
    billingPeriodEnd: {
      type: SchemaTypes.Date,
      required: true,
    },
    totalAmountDue: {
      type: SchemaTypes.Number,
      required: true,
    },
    status: {
      type: SchemaTypes.String,
      required: true,
      enum: BillStatus,
    },
    tariffs: [
      {
        tariffId: {
          type: SchemaTypes.ObjectId,
          ref: "Tariff",
          required: true,
        },
        rate: {
          type: SchemaTypes.Number,
          required: true,
        },
      },
    ],
    paymentId: {
      type: SchemaTypes.ObjectId,
      default: null,
      required: false,
    },
  },
  { timestamps: true }
);

export const BillModel = mongoose.model<IBill>("Bill", BillSchema);
