import { IAdmin, ROLE, verificationStage } from "../types";
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
import { MeterModel } from "../../meters/model";
import { PaymentModel } from "../../payment/model";
import { getAllTimeTotalConsumption } from "../../utils/helper";
export class AdminAuthController {
  /**
   *
   */
  public async createAccount(
    name: string,
    role: ROLE = ROLE.ADMIN,
    password: string,
    email: string
  ): Promise<CustomResponse<string | IAdmin | Error>> {
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
        "An error occured",
        false,
        JSON.stringify(error)
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
        "An error occured",
        false,
        JSON.stringify(error)
      );
    }
  }
  /**
   * verifyRegisterdUser
 :  */
  public async verifyRegisterdUser(
    userId: string,
    status: boolean
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
      if (foundUser.verificationStage != verificationStage.PENDING) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "User already verified",
          false
        );
      }
      await UserModel.findOneAndUpdate(
        { _id: castToObjectId(userId) },
        {
          isVerified: status,
          verificationStage: status
            ? verificationStage.VERIFIED
            : verificationStage.REJECTD,
        }
      );

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
        "An error occured",
        false,
        JSON.stringify(error)
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
        "An error occured",
        false,
        JSON.stringify(error)
      );
    }
  }
  /**
   * getAllUsers
   */
  public async getAllUsers(): Promise<CustomResponse<any>> {
    try {
      const all_users = await UserModel.find().populate("meterId");
      return new CustomResponse(
        HttpStatusCode.Ok,
        "Users retrieved",
        true,
        all_users
      );
    } catch (error: unknown | any) {
      console.log(error);

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

  public async getStats(): Promise<CustomResponse<any>> {
    try {
      const all_users = await UserModel.find().countDocuments();
      const all_meters = await MeterModel.find().countDocuments();
      const txns = await PaymentModel.find().populate("meterId");
      let all_txns = 0;
      txns.forEach((e: any) => {
        all_txns += Number(e.meterId.totalAmountDue);
      });
      const totalConsumption = await getAllTimeTotalConsumption();
      return new CustomResponse(HttpStatusCode.Ok, "Users retrieved", true, {
        all_users,
        all_meters,
        all_txns,
        totalConsumption,
      });
    } catch (error: unknown | any) {
      console.log(error);

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
