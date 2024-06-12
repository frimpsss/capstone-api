import { IAdmin, ROLE } from "../types";
import { loginValidator, registerValidator } from "../utils";
import { AdminModel, UserModel } from "../model";
import {
  createAccessToken,
  findAppUserByID,
  findUserByEmail,
  findUserByID,
  hashPassword,
  isCorrectPassword,
} from "../services";
import CustomResponse from "../../utils/wrapper";
import { HttpStatusCode } from "../../utils/globalTypes";
import { ZodError } from "zod";
import { MongooseError } from "mongoose";
import { castToObjectId } from "../../utils/config";
export class AdminAuthController {
  /**
   *
   */
  public async createAccount(
    name: string,
    role: ROLE = ROLE.ADMIN,
    password: string,
    email: string
  ): Promise<CustomResponse<Error | IAdmin>> {
    try {
      registerValidator.parse({
        name,
        role,
        password,
        email,
      });
      const doesEmailExist = await findUserByEmail(email);
      if (doesEmailExist) {
        return new CustomResponse(
          HttpStatusCode.Conflict,
          "Email Exists",
          false
        );
      }
      const hsdPwd = await hashPassword(password);
      const newAdmin = new AdminModel({
        name,
        role,
        password: hsdPwd,
        email,
      });

      const saved = await newAdmin.save();

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

  //
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

      const foundUser = await findUserByEmail(email);
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

      const token = createAccessToken({
        userId: foundUser._id as string,
        role: foundUser.role,
      });
      return new CustomResponse(
        HttpStatusCode.Ok,
        "Log in succesfull",
        true,
        token
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
  /**
   * verifyRegisterdUser
 :  */
  public async verifyRegisterdUser(
    userId: string
  ): Promise<CustomResponse<any>> {
    try {
      const foundUser = await findAppUserByID(userId);
      if (!foundUser) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "No user found",
          false
        );
      }
      if (!foundUser.isVerified) {
        await UserModel.findOneAndUpdate(
          { _id: castToObjectId(userId) },
          { isVerified: true }
        );
      }

      return new CustomResponse(HttpStatusCode.Ok, "User Verified", true);
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

  /**
   * getAdminInfo
   */
  public async getAdminInfo(userId: string) {
    try {
      if (userId.trim() == "") {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Bad request",
          false
        );
      }

      const foundUser = await AdminModel.findOne({ _id: userId }).select([
        "email",
        "name",
        "role",
      ]);

      if (!foundUser) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "No user found",
          false
        );
      }

      return new CustomResponse(HttpStatusCode.Ok, "Retrived", true, foundUser);
    } catch (error: unknown | any) {
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
