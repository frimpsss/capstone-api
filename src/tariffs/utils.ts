import { z } from "zod";
import { TariffStatus } from "./type";

export const createTariffValidator = z.object({
  name: z.string(),
  rate: z.number(),
  description: z.string(),
  effectiveFrom: z.date(),
  effectiveTo: z.date().optional(),
//   status: z.nativeEnum(TariffStatus),
});
