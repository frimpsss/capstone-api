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
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
