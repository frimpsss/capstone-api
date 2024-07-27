import { ZodError } from "zod";
import { HttpStatusCode } from "../utils/globalTypes";
import CustomResponse from "../utils/wrapper";
import { NotificationType } from "./types";
import { allNotifsPayloadSchema, newNotifSchema } from "./utils";
import { MongooseError } from "mongoose";
import { findAppUserByID } from "../auth/services";
import { NotificationModel } from "./model"; 

export class NotificationController {
  /**
   * createNotification
   */
  public async createNotification({
    title,
    message,
    notifType,
    recipientId,
  }: {
    title: string;
    message: string;
    notifType: NotificationType;
    recipientId?: string;
  }): Promise<CustomResponse<any>> {
    try {
      newNotifSchema.parse({
        title,
        message,
        notificationType: notifType,
        recipientId: recipientId,
      });

      if (recipientId) {
        const foundUser = await findAppUserByID(recipientId);
        if (!foundUser) {
          return new CustomResponse(
            HttpStatusCode.BadRequest,
            "User does not exist",
            false,
            "User does not exist"
          );
        }
      }

      const _newNotif = new NotificationModel({
        title,
        message,
        notificationType: notifType,
        reciepientId: recipientId,
      });

      const saved = await _newNotif.save();

      return new CustomResponse(
        HttpStatusCode.Ok,
        "Notification sent!🚀🚀",
        true,
        saved
      );
    } catch (error: unknown | any) {
      console.log(error);
      if (error instanceof ZodError) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Validation error",
          false,
          error
        );
      }
      if (error instanceof MongooseError) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Mongoose Error",
          false,
          error
        );
      }

      return new CustomResponse(
        HttpStatusCode.InternalServerError,
        "An error occured",
        false,
        JSON.stringify(error)
      );
    }
  }

  /**
   * getAllNotifications
   */
  public async getAllNotifications({
    notificationType,
    userId,
  }: {
    notificationType: NotificationType;
    userId: string;
  }): Promise<CustomResponse<any>> {
    try {
      allNotifsPayloadSchema.parse({
        notificationType,
        userId,
      });
      if (notificationType == NotificationType.GENERAL) {
        const notifs = await NotificationModel.find({
          notificationType: NotificationType.GENERAL,
        });
        return new CustomResponse(
          HttpStatusCode.Ok,
          "All notifs be that",
          true,
          notifs
        );
      }

      const notifs = await NotificationModel.find({
        $or: [
          {
            notificationType: {
              $in: [NotificationType.INDIVIDUAL, NotificationType.GENERAL],
            },
          },
          {
            recipientId: userId,
          },
        ],
      }).sort({ createdAt: "descending" });

      return new CustomResponse(
        HttpStatusCode.Ok,
        "All notifications retrieved",
        true,
        notifs
      );
    } catch (error: unknown | any) {
      console.log(error);
      if (error instanceof ZodError) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Validation error",
          false,
          error
        );
      }
      if (error instanceof MongooseError) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Mongoose Error",
          false,
          error
        );
      }

      return new CustomResponse(
        HttpStatusCode.InternalServerError,
        "An error occured",
        false,
        JSON.stringify(error)
      );
    }
  }
}
