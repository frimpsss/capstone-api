import { z } from "zod";
import { IMeterType } from "./type";

export const createMeterValidator = z.object({
  userId: z.string(),
  gpsAddress: z.string(),
  meterType: z.nativeEnum(IMeterType),
});
