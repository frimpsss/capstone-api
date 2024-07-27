import { z } from "zod";
export enum IMonthNames {
  Jan = "Jan",
  Feb = "Feb",
  Mar = "Mar",
  Apr = "Apr",
  May = "May",
  Jun = "Jun",
  Jul = "Jul",
  Aug = "Aug",
  Sep = "Sep",
  Oct = "Oct",
  Nov = "Nov",
  Dec = "Dec",
}
export const createBillValidator = z.object({
  billingPeriodStart: z.date(),
  billingPeriodEnd: z.date(),
});

export const billingMonthValidator = z.nativeEnum(IMonthNames);

export const monthNames: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export function returnFirstDateLastDate(month: string): {
  firstDate: Date;
  lastDate: number;
} {
  const year = new Date().getFullYear();
  const m = monthNames.indexOf(month);

  if (m == -1) {
    throw new Error("invalid month");
  }
  const firstDate = new Date(year, m - 1, 1);
  const lastDate = new Date(year, m, 1).setDate(0);

  return {
    firstDate,
    lastDate,
  };
}
