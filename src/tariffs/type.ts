import { Document } from "mongoose";

export interface ITariff extends Document {
  name: string;
  rate: number;
  description: string;
  effectiveFrom: Date;
  effectiveTo: Date;
  status: TariffStatus;
}

export enum TariffStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
