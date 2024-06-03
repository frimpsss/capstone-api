import { HttpStatusCode } from "../utils/globalTypes";
import CustomResponse from "../utils/wrapper";
import { saveToken } from "./service";

export class PostNotification {
  public async sendMessage(
    title: string,
    body: string,
    token: string
  ): Promise<CustomResponse<any>> {
    try {
      const msg = {
        token,
        notification: {
          title,
          body,
        },
      };

      return new CustomResponse(HttpStatusCode.Ok, "Message sent", true);
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
      console.log(userId, " ", token)
      await saveToken(userId, token);
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
}
