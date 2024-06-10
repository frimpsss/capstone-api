import * as Z from "zod";
import { NotificationType } from "./types";

export const newNotifSchema = Z.object({
  title: Z.string(),
  message: Z.string(),
  notificationType: Z.nativeEnum(NotificationType),
  recipientId: Z.string().optional(),
}).refine(
  (data) =>
    data.notificationType !== NotificationType.INDIVIDUAL || !!data.recipientId,
  {
    message: "recipientId is required when notificationType is INDIVIDUAL",
    path: ["recipientId"],
  }
);

export const allNotifsPayloadSchema = Z.object({
  notificationType: Z.nativeEnum(NotificationType),
  recipientId: Z.string().optional(),
}).refine(
  (data) =>
    data.notificationType !== NotificationType.INDIVIDUAL || !!data.recipientId,
  {
    message: "recipientId is required when notificationType is INDIVIDUAL",
    path: ["recipientId"],
  }
);
