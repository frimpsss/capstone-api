import { z } from "zod";

export const createMeterValidator = z.object({
  userId: z.string(),
  gpsAddress: z.string(),
});
