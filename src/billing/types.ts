import { Document, ObjectId } from "mongoose";

export interface IBill extends Document {
  meterId: ObjectId;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  totalAmountDue: number;
  status: BillStatus;
  tariffs: IBillTariff[];
  // totalPaid: number;
}
export interface IBillTariff {
  tariffId: string;
  rate: number;
}
export enum BillStatus {
  FULLYPAID = "FULLY_PAID",
  UNPAID = "UNPAID",
  PARTLYPAID = "PARTLY_PAID",
  OVERDUE = "OVERDUE",
}
