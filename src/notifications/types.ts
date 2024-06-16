import { Document, ObjectId } from "mongoose";
export interface INotification extends Document {
  title: string;
  message: string;
  notificationType: NotificationType;
  reciepientId?: ObjectId;
}

export enum NotificationType {
  INDIVIDUAL = "INDIVIDUAL",
  GENERAL = "GENERAL",
  ALL = 'ALL'
}
