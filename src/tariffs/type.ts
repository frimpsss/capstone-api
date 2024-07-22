import { Document } from "mongoose";

export type TARIFF_CHANGE_TYPE = "rate" | "status";
export interface RATE_CHANGE_TYPE {
  oldRate: number;
  newRate: number;
  effectiveFrom: Date;
  effectiveTo: Date;
  date: Date;
}

export interface STATUS_CHANGE_TYPE {
  oldStatus: TariffStatus;
  newStatus: TariffStatus;
  date: Date;
}
export interface IUPDATE {
  type: TARIFF_CHANGE_TYPE;
  updates: RATE_CHANGE_TYPE | STATUS_CHANGE_TYPE;
}
export interface ITariff extends Document {
  name: string;
  rate: number;
  description: string;
  effectiveFrom: Date;
  effectiveTo: Date;
  status: TariffStatus;
  updateHistory: RATE_CHANGE_TYPE[];
}

export enum TariffStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
