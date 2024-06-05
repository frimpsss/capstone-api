import {
  createAccessToken,
  findAppUserByEmail,
  findUserByEmail,
  hashPassword,
  isCorrectPassword,
} from "../services";
import CustomResponse from "../../utils/wrapper";
import { HttpStatusCode } from "../../utils/globalTypes";
import { ZodError } from "zod";
import { MongooseError } from "mongoose";
import { userRegisterValidator } from "../utils";
import { UserModel } from "../model";
import { IUSER } from "../types";

export class UserAuthController {
  /**
   * register
   */
  public async register({
    email,
    password,
    name,
    phoneNumber,
  }: {
    email: string;
    phoneNumber: string;
    name: string;
    password: string;
  }): Promise<CustomResponse<Error | IUSER
>> {
    try {
      userRegisterValidator.parse({
        email,
        password,
        name,
        phoneNumber,
      });
      const doesEmailExist = await findAppUserByEmail(email);
      if (doesEmailExist) {
        return new CustomResponse(
          HttpStatusCode.Conflict,
          "Email Exists",
          false
        );
      }
      const hsdPwd = await hashPassword(password);

      const newUser = new UserModel({
        email,
        password: hsdPwd,
        name,
        phoneNumber,
      });

      const saved = await newUser.save();

      return new CustomResponse(
        HttpStatusCode.Created,
        "User Created",
        true,
        saved
      );
    } catch (error: unknown | any) {
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
        undefined,
        false,
        Error(error?.message)
      );
    }
  }
}
