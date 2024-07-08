import { z } from "zod";

export const createBillValidator = z.object({
  billingPeriodStart: z.date(),
  billingPeriodEnd: z.date(),
});
