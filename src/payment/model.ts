import mongoose, { Schema, SchemaTypes } from "mongoose";

const PaymentSchema = new Schema(
  {
    billId: {
      required: true,
      ref: "Bill",
      type: SchemaTypes.ObjectId,
    },
    txnData: {
      required: true,
      type: SchemaTypes.Mixed,
    },
    userId: {
      required: true,
      ref: "User",
      type: SchemaTypes.ObjectId,
    },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model("Payment", PaymentSchema);
