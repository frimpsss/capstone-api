import { UserModel } from "../auth/model";
import { findAppUserByID } from "../auth/services";
import { HttpStatusCode } from "../utils/globalTypes";
import CustomResponse from "../utils/wrapper";
import { expo } from "./service";

export class PostNotification {
  public async sendMessage(
    title: string,
    body: string,
    userId: string
  ): Promise<CustomResponse<any>> {
    try {
      const foundUser = await findAppUserByID(userId);
      if (!foundUser) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "User does not exist",
          false
        );
      }
      const r = await expo.sendPushNotificationsAsync([
        {
          to: foundUser?.pushToken as string,
          title: title,
          body: body,
        },
      ]);

      return new CustomResponse(
        HttpStatusCode.Ok,
        "Message will be sent",
        true,
        JSON.stringify(r)
      );
    } catch (error: any) {
      console.error(error);
      return new CustomResponse(
        HttpStatusCode.InternalServerError,
        error?.message as string,
        true
      );
    }
  }

  public async registerPushToken(
    userId: string,
    token: string
  ): Promise<CustomResponse<any>> {
    try {
      if (userId.trim() == "" || token?.trim() == "") {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Pass token or userId",
          false
        );
      }
      const foundUser = await findAppUserByID(userId);
      if (!foundUser) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "User does not exist",
          false
        );
      }

      await UserModel.findByIdAndUpdate(foundUser._id, { pushToken: token });

      return new CustomResponse(HttpStatusCode.Ok, "Token Registered", true);
    } catch (error: any) {
      // console.error(error);
      return new CustomResponse(
        HttpStatusCode.InternalServerError,
        error?.message as string,
        true
      );
    }
  }
  /**
   * sendToAllUsers
   */
  public async sendToAllUsers(
    title: string,
    body: string
  ): Promise<CustomResponse<any>> {
    try {
      let user = await UserModel.find();

      const tokens = user.map((e) => {
        if (e.pushToken != undefined) {
          return e.pushToken;
        }
      });
      const messages: any[] = [];
      tokens?.forEach((e) => {
        if (e != undefined) {
          messages.push({
            to: e as string,
            title,
            body,
          });
        }
      });
      console.log(messages);
      await expo.sendPushNotificationsAsync(messages);
      return new CustomResponse(HttpStatusCode.Ok, "Sent", true);
    } catch (error: any) {
      return new CustomResponse(
        HttpStatusCode.InternalServerError,
        error?.message as string,
        true
      );
    }
  }
}
