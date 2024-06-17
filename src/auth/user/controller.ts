import {
  createAccessToken,
  findAppUserByEmail,
  hashPassword,
  isCorrectPassword,
} from "../services";
import CustomResponse from "../../utils/wrapper";
import { HttpStatusCode } from "../../utils/globalTypes";
import { ZodError } from "zod";
import { MongooseError } from "mongoose";
import { loginValidator, string, userRegisterValidator } from "../utils";
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
  }): Promise<CustomResponse<Error | IUSER>> {
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
        undefined,
        false,
        Error(error?.message)
      );
    }
  }
  public async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<CustomResponse<any>> {
    try {
      loginValidator.parse({
        email,
        password,
      });
      const foundUser = await findAppUserByEmail(email);
      if (!foundUser) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Email or Password may be wrong",
          true,
          null
        );
      }
      const pwdCorrect = await isCorrectPassword(password, foundUser.password);
      if (!pwdCorrect) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Email or Password may be wrong",
          true,
          null
        );
      }
      if (!foundUser.isVerified) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Account not verified",
          true,
          null
        );
      }
      const token = createAccessToken({
        userId: foundUser._id as string,
      });

      return new CustomResponse(
        HttpStatusCode.Ok,
        "Log in succesfull",
        true,
        token
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
        undefined,
        false,
        Error(error?.message)
      );
    }
  }

  /**
   * getUserDetails
   */
  public async getUserDetails(userId: string): Promise<CustomResponse<any>> {
    try {
      string.parse({
        userId,
      });
      const foundUser = await UserModel.findById(userId)
        .select(["email", "name", "phoneNumber", "meterId"])
        .populate({
          path: "meterId",
          select: ["gpsAddress", "createdAt"],
        });
      if (!foundUser) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Email or Password may be wrong",
          true,
          null
        );
      }

      return new CustomResponse(
        HttpStatusCode.Ok,
        "User details retrieved",
        true,
        foundUser
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
        undefined,
        false,
        Error(error?.message)
      );
    }
  }
}
