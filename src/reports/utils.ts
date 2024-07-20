import { z } from "zod";

export const createReportValidator = z.object({
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()).optional(),
});
