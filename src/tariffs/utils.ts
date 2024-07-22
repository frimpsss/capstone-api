import { z } from "zod";
import { TARIFF_CHANGE_TYPE } from "./type";

export const createTariffValidator = z.object({
  name: z.string(),
  rate: z.number(),
  description: z.string(),
  effectiveFrom: z.date(),
  effectiveTo: z.date().optional(),
  //   status: z.nativeEnum(TariffStatus),
});

export const updateRateValidator = z.object({
  newRate: z.number(),
  effectiveTo: z.date(),
});

export const RATE_CHANGE_TYPE_VALIDATOR = z.object({
  type: z.custom<TARIFF_CHANGE_TYPE>(),
});
