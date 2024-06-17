import { z } from "zod";
import { ROLE } from "./types";
export const registerValidator = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.nativeEnum(ROLE),
});
export const loginValidator = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const userRegisterValidator = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  phoneNumber: z.string(),
});

export const string = z.object({
  userId: z.string(),
});
