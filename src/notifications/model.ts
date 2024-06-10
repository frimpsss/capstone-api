import mongoose, { Schema, SchemaTypes } from "mongoose";
import { INotification, NotificationType } from "./types";

const NotificationSchema = new Schema<INotification>(
  {
    title: {
      type: SchemaTypes.String,
      required: true,
    },
    reciepientId: {
      type: SchemaTypes.ObjectId,
      required: function (this: INotification) {
        return this.notificationType === NotificationType.INDIVIDUAL;
      },
      ref: "User",
    },
    notificationType: {
      type: SchemaTypes.String,
      enum: NotificationType,
      required: true,
    },
    message: {
      type: SchemaTypes.String,
      required: true,
    },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
